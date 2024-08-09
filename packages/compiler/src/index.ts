/**
 * Given the following:
 * 

<setup>
const val = 123;
</setup>

<output lang="json">
{
  "test": <<val>>
}
</output>

 * The function should return:

{
    "setup": "\nconst val = 123;\n",
    "output": {
        "lang": "json",
        "content": "{\n  \"test\": <<val>>\n}"
    }
}

 */
export function tokenize(source: string) {
    
}