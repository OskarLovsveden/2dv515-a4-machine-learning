import { loadCSV, strColToFloat, strColToInt } from "./utils/csv";
import { mean, stdev } from "./utils/math";

const main = async () => {
  // const dataset = await getData("./data/banknote_authentication.csv");
  // const dataset = await loadCSV("./data/iris.csv");
  // for (let i = 0; i < dataset[0].length - 1; i++) {
  //   strColToFloat(dataset, i);
  // }
  // strColToInt(dataset, dataset[0].length - 1);

  // Test calculating class probabilities
  const dataset = [
    [3.393533211, 2.331273381, 0],
    [3.110073483, 1.781539638, 0],
    [1.343808831, 3.368360954, 0],
    [3.582294042, 4.67917911, 0],
    [2.280362439, 2.866990263, 0],
    [7.423436942, 4.696522875, 1],
    [5.745051997, 3.533989803, 1],
    [9.172168622, 2.511101045, 1],
    [7.792783481, 3.424088941, 1],
    [7.939820817, 0.791637231, 1],
  ];
  const summaries = summarizeByClass(dataset);
  const probabilities = calculateClassProbabilites(summaries, dataset[0]);
  console.log(probabilities);
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
        probabilities.get(classValue)! *
          calculateProbability(row[i], mean, stdev)
      );
    }
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
