import {RootToken, rootKeywords, rootDefaultKeyword, rootAttributeKeyword} from "./root-tokens.js";

export function tokenizeRoot(source: string): RootToken[] {
  const tokens: RootToken[] = [];

  let currentString = "";
  for (let i = 0; i < source.length; i++) {
    currentString += source[i];
    for (const keyword of rootKeywords) {
      const match = currentString.match(keyword.match);
      if (match) {
        const text = currentString.slice(0, currentString.length - match[0].length);
        if (text) {
          tokens.push({
            type: rootDefaultKeyword.type,
            attributes: {value: text},
          });
          currentString = currentString.slice(text.length);
        }
        switch (keyword.type) {
          case "TagOpen": {
            tokens.push({
              type: keyword.type,
              attributes: {name: match[1]},
            });
            const subMatch = currentString.match(rootAttributeKeyword.match);
            if (subMatch) {
              tokens.push({
                type: rootAttributeKeyword.type,
                attributes: {name: subMatch[1], value: subMatch[2]},
              });
            } else {
              // Remove the opening tag and, separately, the closing angle bracket
              currentString = currentString.slice(match[1].length + 1, currentString.length - 1);
              if (!currentString) {
                break;
              }
              tokens.push({
                type: rootDefaultKeyword.type,
                attributes: {value: currentString},
              });
            }
            break;
          }
          case "TagClose": {
            tokens.push({
              type: keyword.type,
              attributes: {name: match[1]},
            });
            break;
          }
          default:
            break;
        }
        currentString = "";
        break;
      }
    }
  }

  return tokens;
}
