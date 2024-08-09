import { test, expect } from "vitest";
import { parseRoot } from "../src/root-parser";
import { tokenizeRoot } from "../src/root-lexer";

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
  console.log(tokens)
  const root = parseRoot(tokens);
  console.log(root)
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