import { loadCSV } from "./utils/csv";
import NaiveBayes from "./NaiveBayes";

const main = async () => {
  // const dataset = await loadCSV("./data/banknote_authentication.csv");
  const dataset = await loadCSV("./data/iris.csv");
  const X: number[][] = [];
  const y: number[] = [];

  for (const row of dataset) {
    X.push(row.slice(0, -1).map((x) => parseFloat(x.trim())));
  }

  const unique = new Set<string>();

  for (const row of dataset) {
    const [label] = row.slice(-1);
    unique.add(label);
    y.push([...unique].indexOf(label));
  }

  const NB = new NaiveBayes();
  NB.fit(X, y);
  const preds = NB.predict(X);
  console.log("Accuracy: " + NB.accuracyScore(preds, y));
};

main();
