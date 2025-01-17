import { test, expect } from "vitest";
import { parseRoot } from "../src/root-parser.js";
import { tokenizeRoot } from "../src/root-lexer.js";

const source = `
<setup>
const setup = 123;
</setup>

<output lang="json">
{
  "test": <<setup>>
}
</output>
`.trim();

test("tokenizeRoot", {}, () => {
  const tokens = tokenizeRoot(source);
  const root = parseRoot(tokens);
  expect(root).toEqual({
    "output": {
      "attributes": {
        "lang": "json",
      },
      "contents": `
{
  "test": <<setup>>
}
`,
    },
    "setup": {
      "attributes": {},
      "contents": `
const setup = 123;
`,
    },
  });
})
