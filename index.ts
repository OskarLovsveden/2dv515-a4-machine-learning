import { loadCSV, strColToFloat, strColToInt } from "./utils/csv";
import { mean, stdev } from "./utils/math";

const main = async () => {
  // const dataset = await getData("./data/banknote_authentication.csv");
  // const dataset = await loadCSV("./data/iris.csv");
  // for (let i = 0; i < dataset[0].length - 1; i++) {
  //   strColToFloat(dataset, i);
  // }
  // strColToInt(dataset, dataset[0].length - 1);
  // TESTS BELOW

  console.log(calculateProbability(1.0, 1.0, 1.0));
  console.log(calculateProbability(2.0, 1.0, 1.0));
  console.log(calculateProbability(0.0, 1.0, 1.0));
};

const calculateProbability = (x: number, mean: number, stdev: number) => {
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
