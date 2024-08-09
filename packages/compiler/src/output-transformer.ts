/*
Given:

```
const someStr = `<div><<val ? "\>>" : "\<<">></div>`;
```

I want to get:

```
`const someStr = \`<div>${val ? ">>" : "<<"}</div>\`;`
```

This means that we need to handle:
- Replacing `<<someVal>>` with `${someVal}`
- Replacing `"\>>"` with `">>"`
- Replacing `"\<<"` with `"<<"`
- Replacing "`" with "\`"

All without using regex.
 */
export function transformOutput(output: string): string {
  const outputArr = output.split("");
  const outputArrLength = outputArr.length;
  const newOutputArr: string[] = [];
  let i = 0;
  while (i < outputArrLength) {
    if (outputArr[i] === "<" && outputArr[i + 1] === "<") {
      let j = i + 2;
      while (j < outputArrLength) {
        if (outputArr[j - 1] !== "\\" && outputArr[j] === ">" && outputArr[j + 1] === ">") {
          newOutputArr.push("${");
          newOutputArr.push(transformOutput(output.substring(i + 2, j)));
          newOutputArr.push("}");
          i = j + 2;
          break;
        }
        j++;
      }
    } else if (outputArr[i] === "\\" && outputArr[i + 1] === ">") {
      newOutputArr.push(">");
      i += 2;
    } else if (outputArr[i] === "\\" && outputArr[i + 1] === "<") {
      newOutputArr.push("<");
      i += 2;
    } else if (outputArr[i] === "`") {
      newOutputArr.push("\\`");
      i++;
    } else {
      newOutputArr.push(outputArr[i]);
      i++;
    }
  }
  return newOutputArr.join("");
}
