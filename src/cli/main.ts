import { parse } from "https://deno.land/std@0.126.0/flags/mod.ts";
import {
  EnglishLanguageDefinition,
  getLanguageDefinition,
} from "../core/language_definitions.ts";
import { LanguageTokenizer } from "../core/language_tokenizer.ts";
import { ParserContext } from "../core/parser/context.ts";
import { parseProgram } from "../core/parser/program.ts";
import { compileProgram } from "../core/compiler.ts";

const args = parse(Deno.args.slice(1), { alias: { language: ["lang", "l"] } });
const languageDefinition = getLanguageDefinition(args.language) ??
  EnglishLanguageDefinition;
const file = args._[0];

if (file === undefined || typeof file !== "string") {
  console.log("No file");
  Deno.exit(-1);
}

const source = await Deno.readTextFile(file);

switch (Deno.args[0]) {
  case "tokenize": {
    const tokenizer = new LanguageTokenizer(languageDefinition);
    const tokens = tokenizer.tokenize(source);

    console.log(JSON.stringify([...tokens], null, 2));
    break;
  }
  case "parse": {
    const tokenizer = new LanguageTokenizer(languageDefinition);
    const tokens = tokenizer.tokenize(source);

    const context = new ParserContext([...tokens]);
    const program = parseProgram(context);

    console.log(JSON.stringify(program, null, 2));
    break;
  }
  case "compile": {
    const tokenizer = new LanguageTokenizer(languageDefinition);
    const tokens = tokenizer.tokenize(source);

    const context = new ParserContext([...tokens]);
    const program = parseProgram(context);

    console.log(compileProgram(program));
    break;
  }
  case "run": {
    const tokenizer = new LanguageTokenizer(languageDefinition);
    const tokens = tokenizer.tokenize(source);

    const context = new ParserContext([...tokens]);
    const program = parseProgram(context);

    // Suuuuper unsafe, but anyways
    eval(compileProgram(program));
    break;
  }
  default: {
    console.log("Unknown command");
    break;
  }
}
