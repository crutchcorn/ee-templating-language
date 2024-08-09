import { test, expect } from "vitest";
import {transformOutput} from "../src/output-transformer";

test("outputTransformer", {}, () => {
  const source = 'const someStr = `<div><<val ? "\\>\\>" : "\\<\\<">></div>`;';
  const cleaned = transformOutput(source);
  expect(cleaned).toEqual('const someStr = \\`<div>${val ? ">>" : "<<"}</div>\\`;');
})
