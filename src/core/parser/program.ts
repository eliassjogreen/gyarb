import { Node, NodeParser } from "./node.ts";
import { ParserContext } from "./context.ts";
import { Macro, parseMacro } from "./macro.ts";
import { parseStatement, Statement } from "./statement.ts";

export interface Program extends Node<ProgramStatement[]> {
  type: "program";
}

export const parseProgram: NodeParser<Program> = (context: ParserContext) => {
  const program: ProgramStatement[] = [];

  while (context.current) {
    program.push(parseProgramStatement(context));
  }

  return {
    type: "program",
    value: program,
  };
};

export type ProgramStatement =
  | FunctionDeclaration
  | Block
  | Macro;

export const parseProgramStatement: NodeParser<ProgramStatement> = (
  context: ParserContext,
) => {
  switch (context.current.type) {
    case "macro":
      return parseMacro(context);
    case "function":
      return parseFunctionDeclaration(context);
    case "left_brace":
      return parseBlock(context);
  }

  throw `Could not parse program statement ${JSON.stringify(context.current)}`;
};

export interface FunctionDeclaration extends
  Node<{
    name: string;
    parameters: string[];
    body: Statement;
  }> {
  type: "function_declaration";
}

export const parseFunctionDeclaration: NodeParser<FunctionDeclaration> = (
  context: ParserContext,
) => {

  context.eat({ type: "function" });

  const name = context.eat({ type: "identifier" }).value as string;

  let parameters: string[] = [];

  if (context.is({ type: "left_parenthesis" })) {
    parameters = context.delimited(
      { type: "left_parenthesis" },
      { type: "right_parenthesis" },
      { type: "comma" },
      () => context.eat({ type: "identifier" }).value as string,
    );
  }

  const body = parseStatement(context);

  return {
    type: "function_declaration",
    value: {
      name,
      parameters,
      body,
    },
  };
};

export interface Block extends Node<Statement[]> {
  type: "block";
}

export const parseBlock: NodeParser<Block> = (
  context: ParserContext,
) => {
  const statements: Statement[] = [];

  context.eat({ type: "left_brace" });

  while (!context.is({ type: "right_brace" })) {
    statements.push(parseStatement(context));
  }

  context.eat({ type: "right_brace" });

  return {
    type: "block",
    value: statements,
  };
};
