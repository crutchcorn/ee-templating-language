import * as path from "node:path";
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

import {test, expect} from "vitest";

import {compile} from "../src/index.js";
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("compiles a basic file", () => {
  const result = compile(fs.readFileSync(path.resolve(__dirname, "../../../sample/test.json.ee"), "utf8"), {});

  expect(result).toMatchSnapshot();
});

test("compiles an array-interpolated file", () => {
  const result = compile(fs.readFileSync(path.resolve(__dirname, "../../../sample/array.json.ee"), "utf8"), {});

  expect(result).toMatchSnapshot();
});
