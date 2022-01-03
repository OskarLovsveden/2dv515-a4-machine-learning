import fs from "fs";
import { parse } from "csv";
import { Parser } from "csv-parse/.";

const parser = (path: string): Parser => {
  const parser = fs.createReadStream(path).pipe(
    parse({
      from_line: 2,
      delimiter: ",",
    })
  );

  return parser;
};

const loadCSV = async (path: string): Promise<any[]> => {
  const data = [];
  const p = parser(path);

  for await (const r of p) {
    data.push(r);
  }

  return data;
};

const strColToFloat = (dataset: any[], col: number): void => {
  for (const row of dataset) {
    row[col] = parseFloat(row[col].trim());
  }
};

const strColToInt = (dataset: any[], col: number): void => {
  const unique = new Set<string>();
  const lookup = new Map<string, number>();

  for (const row of dataset) {
    unique.add(row[col].trim());
  }

  for (const [i, value] of [...unique].entries()) {
    lookup.set(value, i);
  }

  for (const row of dataset) {
    row[col] = lookup.get(row[col]);
  }
};

export { loadCSV, strColToFloat, strColToInt };
