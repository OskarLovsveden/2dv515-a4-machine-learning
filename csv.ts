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
