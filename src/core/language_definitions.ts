import { LanguageDefinition } from "./language_definition.ts";

export function getLanguageDefinition(identifier: string) {
  switch (identifier) {
    case "sv":
      return SwedishLanguageDefinition;
    case "en":
      return EnglishLanguageDefinition;
    case "de":
      return GermanLanguageDefinition;
    case "fr":
      return FrenchLanguageDefinition;
  }
}

export const EnglishLanguageDefinition: LanguageDefinition = {
  keywords: {
    function: "function",
    return: "return",
    if: "if",
    while: "while",
    break: "break",
    continue: "continue",
    variable: "variable",
    constant: "constant",
    none: "none",
  },
  boolean: {
    true: "true",
    false: "false",
  },
};

export const SwedishLanguageDefinition: LanguageDefinition = {
  keywords: {
    function: "funktion",
    return: "returnera",
    if: "om",
    while: "medan",
    break: "avbryt",
    continue: "fortsätt",
    variable: "variabel",
    constant: "konstant",
    none: "inget",
  },
  boolean: {
    true: "sant",
    false: "falskt",
  },
};

export const GermanLanguageDefinition: LanguageDefinition = {
  keywords: {
    function: "funktion",
    return: "rückkehr",
    if: "ob",
    while: "während",
    break: "abbrechen",
    continue: "fortsetzen",
    variable: "variable",
    constant: "konstante",
    none: "null",
  },
  boolean: {
    true: "wahr",
    false: "falsch",
  },
};

export const FrenchLanguageDefinition: LanguageDefinition = {
  keywords: {
    function: "function",
    return: "retourne",
    if: "si",
    while: "pendant",
    break: "casse",
    continue: "continue",
    variable: "variable",
    constant: "constant",
    none: "rien",
  },
  boolean: {
    true: "vrai",
    false: "faux",
  },
};
