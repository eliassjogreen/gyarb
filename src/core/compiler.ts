import { Expression } from "./parser/expression.ts";
import { Macro } from "./parser/macro.ts";
import { Operator } from "./parser/operator.ts";
import {
  Block,
  FunctionDeclaration,
  Program,
  ProgramStatement,
} from "./parser/program.ts";
import { Statement } from "./parser/statement.ts";

export function compileProgram(program: Program): string {
  let final = "";

  for (const statement of program.value) {
    final += compileProgramStatement(statement);
  }

  return final;
}

export function compileProgramStatement(statement: ProgramStatement): string {
  switch (statement.type) {
    case "macro":
      return compileMacro(statement);
    case "block":
      return compileBlock(statement);
    case "function_declaration":
      return compileFunctionDeclaration(statement);
  }
}

export function compileMacro(
  macro: Macro,
): string {
  // Possibly extend this later if i ever need to
  return macro.value.type === "js" ? macro.value.value : "";
}

export function compileBlock(block: Block): string {
  return `(()=>{${
    block.value.map(compileStatement).join(
      "",
    )
  }})();`;
}

export function compileFunctionDeclaration(
  declaration: FunctionDeclaration,
): string {
  let result = "";

  result += `function ${declaration.value.name}(${
    declaration.value
      .parameters.join(
        ",",
      )
  }){${compileStatement(declaration.value.body)}}`;

  return result;
}

export function compileStatement(statement: Statement): string {
  switch (statement.type) {
    case "macro":
      return compileMacro(statement);
    case "if_statement":
      return `if(${
        compileExpression(
          statement.value.condition,
        )
      }){${
        compileStatement(
          statement.value.then,
        )
      }}${
        statement.value.else
          ? `else{${
            compileStatement(
              statement.value.else,
            )
          }}`
          : ""
      }`;
    case "while_statement":
      return `while(${
        compileExpression(
          statement.value.condition,
        )
      }){${compileStatement(statement.value.then)}}`;
    case "return_statement":
      return `return ${compileExpression(statement.value)};`;
    case "continue_statement":
      return `continue;`;
    case "break_statement":
      return `break;`;
    case "variable_declaration":
      return `let ${statement.value.name}=${
        compileExpression(
          statement.value.value,
        )
      };`;
    case "constant_declaration":
      return `const ${statement.value.name}=${
        compileExpression(
          statement.value.value,
        )
      };`;
    case "block":
      return statement.value.map(compileStatement).join(";");
    case "expression_statement":
      return `${compileExpression(statement.value)};`;
    default:
      throw `Could not compile statement "${JSON.stringify(statement)}"`;
  }
}

export function compileExpression(expression: Expression): string {
  switch (expression.type) {
    case "unary_expression":
      return `${compileOperator(expression.value.operator)}${
        compileExpression(
          expression.value.operand,
        )
      }`;
    case "binary_expression":
      return `${
        compileExpression(
          expression.value.left,
        )
      }${
        compileOperator(
          expression.value.operator,
        )
      }${
        compileExpression(
          expression.value.right,
        )
      }`;
    case "if_expression":
      return `${
        compileExpression(
          expression.value.condition,
        )
      }?${compileExpression(expression.value.then)}:${
        compileExpression(
          expression.value.else,
        )
      }`;
    case "boolean_literal":
    case "number_literal":
      return expression.value.toString();
    case "string_literal":
      return `"${expression.value}"`;
    case "none_literal":
      return "undefined";
    case "function_call":
      return `${expression.value.name}(${
        expression.value.parameters.map(compileExpression)
          .join(",")
      })`;
    case "variable_access":
      return `${expression.value}`;
    case "grouping":
      return `(${expression.value})`;
    default:
      throw `Could not compile expression "${JSON.stringify(expression)}"`;
  }
}

export function compileOperator(operator: Operator): string {
  return operator.value;
}
