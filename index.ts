import { loadCSV, strColToFloat, strColToInt } from "./utils/csv";
import { mean, stdev } from "./utils/math";

const main = async () => {
  // const dataset = await loadCSV("./data/banknote_authentication.csv");
  const dataset = await loadCSV("./data/iris.csv");
  for (let i = 0; i < dataset[0].length - 1; i++) {
    strColToFloat(dataset, i);
  }
  strColToInt(dataset, dataset[0].length - 1);

  const model = summarizeByClass(dataset);

  const preds = dataset.map((row) => {
    const pred = calculateClassProbabilites(model, row);
    return pred;
  });

  console.log(getAccuracy(preds, dataset));
};

const getAccuracy = (preds: Map<number, number>[], dataset: number[][]) => {
  let correct_classification = 0;

  for (let i = 0; i < preds.length; i++) {
    const [label] = dataset[i].slice(-1);

    let bestLabel = null;
    let bestPred = -1;

    for (const [cv, p] of preds[i]) {
      if (bestLabel === null || p > bestPred) {
        bestLabel = cv;
        bestPred = p;
      }
    }

    if (label === bestLabel) correct_classification++;
  }

  return correct_classification / dataset.length;
};

const calculateClassProbabilites = (
  summaries: Map<number, number[][]>,
  row: number[]
) => {
  const totalRows = Array.from(summaries.values()).reduce((sum, cs) => {
    const [count] = cs[0].slice(-1);
    return sum + count;
  }, 0);

  const probabilities = new Map<number, number>();

  for (const [classValue, classSummaries] of summaries.entries()) {
    const [count] = summaries.get(classValue)![0].slice(-1);
    probabilities.set(classValue, count / totalRows);
    for (const [i, classSummary] of classSummaries.entries()) {
      const [mean, stdev, count] = classSummary;

      probabilities.set(
        classValue,
        probabilities.get(classValue)! +
          calculateProbability(row[i], mean, stdev)
        // Math.log(calculateProbability(row[i], mean, stdev))
      );
    }

    // probabilities.set(classValue, Math.exp(probabilities.get(classValue)!));
  }

  return probabilities;
};

const calculateProbability = (
  x: number,
  mean: number,
  stdev: number
): number => {
  const exponent = Math.exp(-((x - mean) ** 2 / (2 * stdev ** 2)));
  return (1 / (Math.sqrt(2 * Math.PI) * stdev)) * exponent;
};

const separateByClass = (dataset: number[][]): Map<number, number[][]> => {
  const separated = new Map<number, number[][]>();

  for (const vector of dataset) {
    const classValue = vector[vector.length - 1];

    if (!separated.has(classValue)) {
      separated.set(classValue, []);
    }

    separated.get(classValue)?.push(vector);
  }

  return separated;
};

const summarizeByClass = (dataset: number[][]): Map<number, number[][]> => {
  const separated = separateByClass(dataset);
  const summaries = new Map<number, number[][]>();

  for (const [classValue, rows] of separated.entries()) {
    if (!summaries.has(classValue)) {
      summaries.set(classValue, summarizeDataset(rows));
    }
  }

  return summaries;
};

const summarizeDataset = (dataset: number[][]): number[][] => {
  const summaries = [];

  for (let i = 0; i < dataset[0].length - 1; i++) {
    const col = dataset.map((x) => x[i]);
    summaries.push([mean(col), stdev(col), col.length]);
  }

  return summaries;
};

main();
