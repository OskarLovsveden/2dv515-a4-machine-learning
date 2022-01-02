import { loadCSV, strColToFloat, strColToInt } from "./csv";

const main = async () => {
  // const dataset = await getData("./data/banknote_authentication.csv");
  //   const dataset = await loadCSV("./data/iris.csv");
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
  console.log(separateByClass(dataset));
  //   for (let i = 0; i < dataset[0].length - 1; i++) {
  //     strColToFloat(dataset, i);
  //   }
  //   strColToInt(dataset, dataset[0].length - 1);
  //   const model = summarizeByClass(dataset);
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

main();
