import { Pattern } from "./tokenizer.ts";

export interface LanguageDefinition {
  keywords: {
    import: Pattern;
    from: Pattern;
    export: Pattern;
    function: Pattern;
    return: Pattern;
    if: Pattern;
    while: Pattern;
    break: Pattern;
    continue: Pattern;
    variable: Pattern;
    constant: Pattern;
  };
  boolean: {
    true: string;
    false: string;
  };
}
