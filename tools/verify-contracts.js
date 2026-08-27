const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const [originalPath, readablePath] = process.argv.slice(2);
if (!originalPath || !readablePath) throw new Error("Usage: node verify-contracts.js ORIGINAL READABLE");
const parseOptions = { sourceType: "script", plugins: ["asyncGenerators", "bigInt", "classProperties", "dynamicImport", "optionalChaining", "objectRestSpread", "topLevelAwait"] };

function inventory(filePath) {
  const ast = parser.parse(fs.readFileSync(filePath, "utf8"), parseOptions);
  const globals = new Set();
  const functions = new Set();
  for (const statement of ast.program.body) {
    if (statement.type === "FunctionDeclaration") functions.add(statement.id.name);
  }
  traverse(ast, {
    AssignmentExpression(path) {
      const left = path.node.left;
      if (left.type !== "MemberExpression" || left.object.type !== "Identifier" || left.object.name !== "window") return;
      if (!left.computed && left.property.type === "Identifier") globals.add(left.property.name);
      if (left.computed && left.property.type === "StringLiteral") globals.add(left.property.value);
    },
  });
  return { functions: [...functions].sort(), globals: [...globals].sort() };
}

const original = inventory(originalPath);
const readable = inventory(readablePath);
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const result = {
  originalPath,
  readablePath,
  globalAssignmentsMatch: equal(original.globals, readable.globals),
  topLevelFunctionsMatch: equal(original.functions, readable.functions),
  original,
  readable,
};
console.log(JSON.stringify(result, null, 2));
if (!result.globalAssignmentsMatch || !result.topLevelFunctionsMatch) process.exitCode = 1;
