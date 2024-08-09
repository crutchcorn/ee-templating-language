import { test, expect } from "vitest";
import {outputTransformer} from "../src/output-transformer";

test("outputTransformer", {}, () => {
  const source = 'const someStr = `<div><<val ? "\\>\\>" : "\\<\\<">></div>`;';
  const cleaned = outputTransformer(source);
  expect(cleaned).toEqual('const someStr = \\`<div>${val ? ">>" : "<<"}</div>\\`;');
})
