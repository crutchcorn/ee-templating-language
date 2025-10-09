interface RootAttribute {
    name: string;
    value: string;
}

interface RootTag {
    name: string;
}

interface RootText {
    value: string;
}

export const rootDefaultKeyword =     { match: /[^<]+/, type: "Text", attributes: {} as RootText }as const;

export const rootAttributeKeyword =
    { match: /([a-zA-Z-]+)="([^"]*)"/, type: "TagAttribute", attributes: {} as RootAttribute } as const;

export const rootKeywords = [
    // TagOpenEnd is implicit
    { match: /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/, type: "TagOpenStart", attributes: {} as RootTag },
    { match: /<\/([a-zA-Z][a-zA-Z0-9]*)>/, type: "TagClose", attributes: {} as RootTag }
] as const;

export type RootToken = {
    type: "TagOpenStart";
    attributes: RootTag;
} | {
    type: "TagOpenEnd";
    attributes: RootTag;
} | {
    type: "TagClose";
    attributes: RootTag;
} | {
    type: "TagAttribute";
    attributes: RootAttribute;
} | {
    type: "Text";
    attributes: RootText;
};
