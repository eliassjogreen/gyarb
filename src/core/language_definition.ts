import { Pattern } from "./tokenizer.ts";

export interface LanguageDefinition {
  keywords: {
    function: Pattern;
    return: Pattern;
    if: Pattern;
    while: Pattern;
    break: Pattern;
    continue: Pattern;
    variable: Pattern;
    constant: Pattern;
    none: Pattern;
  };
  boolean: {
    true: string;
    false: string;
  };
}
