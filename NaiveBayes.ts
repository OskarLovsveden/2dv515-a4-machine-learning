import { mean, stdev } from "./utils/math";

type Attribute = {
  mean: number;
  stdev: number;
  count: number;
};

class NaiveBayes {
  private model: Map<number, Attribute[]> = new Map();

  fit = (X: number[][], y: number[]): void => {
    const separated = this.separateByClass(X, y);
    const summaries = new Map<number, Attribute[]>();

    for (const [label, rows] of separated.entries()) {
      if (!summaries.has(label)) {
        summaries.set(label, this.summarizeDataset(rows));
      }
    }

    this.model = summaries;
  };

  private separateByClass = (
    X: number[][],
    y: number[]
  ): Map<number, number[][]> => {
    const separated = new Map<number, number[][]>();

    for (let i = 0; i < X.length; i++) {
      const label = y[i];
      const row = X[i];

      if (!separated.has(label)) separated.set(label, []);
      separated.get(label)?.push(row);
    }

    return separated;
  };

  private summarizeDataset = (dataset: number[][]): Attribute[] => {
    const summaries = [];

    for (let i = 0; i < dataset[0].length; i++) {
      const col = dataset.map((x) => x[i]);
      summaries.push({ mean: mean(col), stdev: stdev(col), count: col.length });
    }

    return summaries;
  };

  predict = (X: number[][]): number[] => {
    const totalRows = X.length;

    const preds = X.map((row) => {
      const pred = new Map<number, number>();

      for (const [cv, cs] of this.model.entries()) {
        const count = this.model.get(cv)![0].count;
        pred.set(cv, count / totalRows);
        for (const [i, classSummary] of cs.entries()) {
          const { mean, stdev, count } = classSummary;

          pred.set(
            cv,
            pred.get(cv)! +
              // Comment out next line to go w/o Math.log / Math.exp
              //this.calculateProbability(row[i], mean, stdev)
              Math.log(this.calculateProbability(row[i], mean, stdev))
          );
        }

        // Comment out next line to go w/o Math.log / Math.exp
        pred.set(cv, Math.exp(pred.get(cv)!));
      }

      return pred;
    });

    return this.getBest(preds);
  };

  private calculateProbability = (
    x: number,
    mean: number,
    stdev: number
  ): number => {
    const exponent = Math.exp(-((x - mean) ** 2 / (2 * stdev ** 2)));
    return (1 / (Math.sqrt(2 * Math.PI) * stdev)) * exponent;
  };

  private getBest = (preds: Map<number, number>[]) => {
    const best: number[] = [];

    for (const pred of preds) {
      let bestLabel = -1;
      let bestPred = -1;

      for (const [cv, p] of pred.entries()) {
        if (bestLabel === -1 || p > bestPred) {
          bestLabel = cv;
          bestPred = p;
        }
      }

      best.push(bestLabel);
    }

    return best;
  };

  accuracyScore = (preds: number[], y: number[]): number => {
    let accurate_counter = 0;

    for (let i = 0; i < preds.length; i++) {
      const pred = preds[i];
      const label = y[i];

      if (pred === label) accurate_counter++;
    }

    return accurate_counter / y.length;
  };
}

export default NaiveBayes;
