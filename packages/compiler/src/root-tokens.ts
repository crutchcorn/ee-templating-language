export interface RootAttribute {
    name: string;
    value: string;
}

export interface RootTag {
    name: string;
}

export interface RootText {
    value: string;
}

export const rootDefaultKeyword =     { match: /[^<]+/, type: "Text", attributes: {} as RootText }as const;

export const rootAttributeKeyword =
    { match: /([a-zA-Z-]+)="([^"]*)"/, type: "TagAttribute", attributes: {} as RootAttribute } as const;

export const rootKeywords = [
    { match: /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/, type: "TagOpen", attributes: {} as RootTag },
    { match: /<\/([a-zA-Z][a-zA-Z0-9]*)>/, type: "TagClose", attributes: {} as RootTag }
] as const;

export type RootToken = {
    type: "TagOpen";
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
