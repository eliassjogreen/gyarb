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
  | ImportDeclaration
  | Block
  | Macro;

export const parseProgramStatement: NodeParser<ProgramStatement> = (
  context: ParserContext,
) => {
  switch (context.current.type) {
    case "macro":
      return parseMacro(context);
    case "export":
    case "function":
      return parseFunctionDeclaration(context);
    case "import":
      return parseImportDeclaration(context);
    case "LeftBrace":
      return parseBlock(context);
  }

  throw `Could not parse program statement ${JSON.stringify(context.current)}`;
};

export interface FunctionDeclaration extends
  Node<{
    exported: boolean;
    name: string;
    parameters: string[];
    body: Statement;
  }> {
  type: "function_declaration";
}

export const parseFunctionDeclaration: NodeParser<FunctionDeclaration> = (
  context: ParserContext,
) => {
  const exported = context.is({ type: "export" })
    ? context.eat({ type: "export" }) && true
    : false;

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
      exported,
      name,
      parameters,
      body,
    },
  };
};

export interface ImportDeclaration extends
  Node<{
    names?: string[];
    module: string;
  }> {
  type: "import_declaration";
}

export const parseImportDeclaration: NodeParser<ImportDeclaration> = (
  context: ParserContext,
) => {
  context.eat({ type: "import" });

  const names = context.is({ type: "identifier" })
    ? context.until(
      { type: "from" },
      { type: "comma" },
      () => context.eat({ type: "identifier" }).value as string,
    )
    : undefined;

  const module = context.eat({ type: "string" }).value as string;

  return {
    type: "import_declaration",
    value: {
      names,
      module,
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
