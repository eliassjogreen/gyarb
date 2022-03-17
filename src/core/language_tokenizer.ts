import { LanguageDefinition } from "./language_definition.ts";
import { Tokenizer } from "./tokenizer.ts";

export class LanguageTokenizer extends Tokenizer {
  constructor(language: LanguageDefinition) {
    super([
      { type: "whitespace", pattern: /\s+/, ignore: true },
      { type: "comment", pattern: /\/\/.*/, ignore: true },
      { type: "comment", pattern: /\/\*[.\n]*\*\//, ignore: true },

      { type: "function", pattern: language.keywords.function },
      { type: "return", pattern: language.keywords.return },
      { type: "if", pattern: language.keywords.if },
      { type: "while", pattern: language.keywords.while },
      { type: "break", pattern: language.keywords.break },
      { type: "continue", pattern: language.keywords.continue },
      { type: "variable", pattern: language.keywords.variable },
      { type: "constant", pattern: language.keywords.constant },
      { type: "none", pattern: language.keywords.none },

      {
        type: "boolean",
        pattern: [language.boolean.true, language.boolean.false],
        value: (m: { match: string }) => m.match === language.boolean.true,
      },
      {
        type: "number",
        pattern: /[0-9]+(\.[0-9]+)?/,
        value: (m: { match: string }) => parseFloat(m.match),
      },
      {
        type: "string",
        pattern: /"(.*?[^\\])"/,
        value: (m: { groups: string[] }) => m.groups[0],
      },

      { type: "identifier", pattern: /\p{L}[\p{L}\p{S}\p{N}]*/u },

      {
        type: "macro",
        pattern: /#\[([^\]]*)\]\s*{((?:[^}]|})*)}/,
        value: (m: { groups: string[] }) => ({
          type: m.groups[0],
          value: m.groups[1],
        }),
      },
      {
        type: "macro",
        pattern: /#\[([^\]]*)\]\s*(.*)/,
        value: (m: { groups: string[] }) => ({
          type: m.groups[0],
          value: m.groups[1],
        }),
      },

      { type: "left_parenthesis", pattern: "(" },
      { type: "right_parenthesis", pattern: ")" },
      { type: "left_brace", pattern: "{" },
      { type: "right_brace", pattern: "}" },
      { type: "comma", pattern: "," },
      { type: "colon", pattern: ":" },

      { type: "assignment", pattern: "=" },

      { type: "addition", pattern: "+" },
      { type: "subtraction", pattern: "-" },
      { type: "multiplication", pattern: "*" },
      { type: "division", pattern: "/" },
      { type: "modulo", pattern: "%" },

      { type: "equality", pattern: "==" },
      { type: "inequality", pattern: "!=" },
      { type: "less_than", pattern: "<" },
      { type: "less_than_equal", pattern: "<=" },
      { type: "greater_than", pattern: ">" },
      { type: "greater_than_equal", pattern: ">=" },

      { type: "logical_not", pattern: "!" },
      { type: "logical_or", pattern: "||" },
      { type: "logical_and", pattern: "&&" },
    ]);
  }
}
