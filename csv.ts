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

export const loadCSV = async (path: string): Promise<any[]> => {
  const data = [];
  const p = parser(path);

  for await (const r of p) {
    data.push(r);
  }

  return data;
};

export const strColToFloat = (dataset: any[], col: number): void => {
  for (const row of dataset) {
    row[col] = parseFloat(row[col].trim());
  }
};
