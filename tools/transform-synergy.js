/*
 * Conservative, syntax-preserving source cleanup for Synergy's browser scripts.
 * This tool never evaluates the target program: every rewrite is confined to an
 * AST subtree made entirely of literals or a known intrinsic string operation.
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;

const [inputPath, outputPath, reportPath] = process.argv.slice(2);
if (!inputPath || !outputPath || !reportPath) {
  throw new Error("Usage: node transform-synergy.js INPUT OUTPUT REPORT");
}

const source = fs.readFileSync(inputPath, "utf8");
const parseOptions = {
  sourceType: "script",
  plugins: ["asyncGenerators", "bigInt", "classProperties", "dynamicImport", "optionalChaining", "objectRestSpread", "topLevelAwait"],
};
const ast = parser.parse(source, parseOptions);
const counts = { stringEscape: 0, boolean: 0, reverseString: 0, binaryLiteral: 0, memberProperty: 0, removedJunkBindings: 0, removedJunkWrites: 0, loaderRenames: 0, localRenames: 0 };

function isEmptyString(node) {
  return t.isStringLiteral(node, { value: "" });
}

function reversedString(path) {
  const join = path.node;
  if (!t.isCallExpression(join) || !t.isMemberExpression(join.callee) || !t.isIdentifier(join.callee.property, { name: "join" }) || !isEmptyString(join.arguments[0])) return null;
  const reverse = join.callee.object;
  if (!t.isCallExpression(reverse) || !t.isMemberExpression(reverse.callee) || !t.isIdentifier(reverse.callee.property, { name: "reverse" }) || reverse.arguments.length) return null;
  const split = reverse.callee.object;
  if (!t.isCallExpression(split) || !t.isMemberExpression(split.callee) || !t.isIdentifier(split.callee.property, { name: "split" }) || !isEmptyString(split.arguments[0])) return null;
  if (!t.isStringLiteral(split.callee.object)) return null;
  return split.callee.object.value.split("").reverse().join("");
}

function literalValue(node) {
  if (t.isNumericLiteral(node) || t.isStringLiteral(node) || t.isBooleanLiteral(node) || t.isNullLiteral(node)) return node.value;
  if (t.isUnaryExpression(node) && (node.operator === "+" || node.operator === "-" || node.operator === "!" || node.operator === "~") && t.isNumericLiteral(node.argument)) {
    return ({ "+": +node.argument.value, "-": -node.argument.value, "!": !node.argument.value, "~": ~node.argument.value })[node.operator];
  }
  return undefined;
}

function foldBinary(node) {
  const left = literalValue(node.left);
  const right = literalValue(node.right);
  if (left === undefined || right === undefined) return undefined;
  switch (node.operator) {
    case "^": return left ^ right;
    case "&": return left & right;
    case "|": return left | right;
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return left / right;
    case "%": return left % right;
    case "<<": return left << right;
    case ">>": return left >> right;
    case ">>>": return left >>> right;
    case "**": return left ** right;
    default: return undefined;
  }
}

// Replacement can expose one larger literal expression to its parent. Iterate
// this strictly literal-only pass to a small fixed point before any binding work.
for (let cleanupPass = 0; cleanupPass < 8; cleanupPass++) traverse(ast, {
  StringLiteral(path) {
    // Babel otherwise preserves the raw Unicode-escaped spelling from source.
    // The decoded AST value is identical, while the generated spelling is readable.
    if (path.node.extra && path.node.extra.raw && /\\u[0-9a-f]{4}/i.test(path.node.extra.raw)) {
      path.node.extra = undefined;
      counts.stringEscape++;
    }
  },
  CallExpression(path) {
    const value = reversedString(path);
    if (value !== null) {
      path.replaceWith(t.stringLiteral(value));
      counts.reverseString++;
    }
  },
  UnaryExpression: {
    exit(path) {
    const { node } = path;
    if (node.operator === "!" && t.isArrayExpression(node.argument) && node.argument.elements.length === 0) {
      path.replaceWith(t.booleanLiteral(false));
      counts.boolean++;
    }
    if (node.operator === "!" && t.isBooleanLiteral(node.argument)) {
      path.replaceWith(t.booleanLiteral(!node.argument.value));
      counts.boolean++;
    }
    }
  },
  BinaryExpression(path) {
    const value = foldBinary(path.node);
    if (value !== undefined && Number.isFinite(value)) {
      path.replaceWith(t.numericLiteral(value));
      counts.binaryLiteral++;
    }
  },
  MemberExpression(path) {
    const { node } = path;
    if (node.computed && t.isStringLiteral(node.property) && t.isValidIdentifier(node.property.value)) {
      node.property = t.identifier(node.property.value);
      node.computed = false;
      counts.memberProperty++;
    }
  },
});

// Obfuscator markers in these sources use _0x-prefixed bindings. Remove one only
// when Babel proves there are no reads and every write is a standalone pure
// expression; this avoids changing hoisting, exceptions, or observable writes.
const visitedScopes = new Set();
const evalSafetyCache = new WeakMap();
function hasDynamicScopeAccess(functionScope) {
  if (!functionScope) return true;
  if (evalSafetyCache.has(functionScope)) return evalSafetyCache.get(functionScope);
  let unsafe = false;
  functionScope.path.traverse({
    WithStatement() { unsafe = true; },
    CallExpression(path) {
      if (path.get("callee").isIdentifier({ name: "eval" }) && !path.scope.getBinding("eval")) unsafe = true;
    },
  });
  evalSafetyCache.set(functionScope, unsafe);
  return unsafe;
}
traverse(ast, {
  Scopable(path) {
    if (visitedScopes.has(path.scope)) return;
    visitedScopes.add(path.scope);
    for (const binding of Object.values(path.scope.bindings)) {
      if (!/^_0x/.test(binding.identifier.name) || binding.referencePaths.length !== 0) continue;
      const writes = binding.constantViolations;
      if (!writes.every(write => write.parentPath.isExpressionStatement() && write.isAssignmentExpression() && write.node.operator === "=" && write.get("right").isPure())) continue;
      const declaration = binding.path;
      if (!declaration.isVariableDeclarator() || (declaration.node.init && !declaration.get("init").isPure())) continue;
      const kind = declaration.parentPath.node.kind;
      const functionScope = declaration.scope.getFunctionParent();
      const safeLocalVar = kind === "var" && functionScope && !functionScope.path.isProgram() && !hasDynamicScopeAccess(functionScope);
      // Preserve classic-script top-level var declarations: they can be observable
      // as window properties. Function-local var is removable only after proving
      // the function cannot expose its lexical environment through eval or with.
      if (kind !== "let" && !safeLocalVar) continue;
      for (const write of writes) write.parentPath.remove();
      declaration.remove();
      counts.removedJunkBindings++;
      counts.removedJunkWrites += writes.length;
    }
  },
});

// The loader has a small, stable public bootstrap surface. These names are based
// on their direct roles and are changed through Babel bindings, never text replace.
if (path.basename(inputPath).toLowerCase() === "loader.js") {
  const renameMaps = {
    wispUrl: { e: "endpoint" },
    testWispDomain: { e: "domain", t: "resolvePing", r: "socket", n: "handshakeComplete", i: "pingStart", o: "pingId", s: "timeoutId", l: "finish" },
    getWisp: { e: "storedIndex", t: "parsedIndex", r: "hasStoredIndex" },
    preload: { e: "assetUrl" },
    loadScript: { e: "scriptUrl", t: "resolveLoad", r: "rejectLoad" },
    initTransport: { e: "transport" },
  };
  traverse(ast, {
    FunctionDeclaration(path) {
      const mapping = renameMaps[path.node.id && path.node.id.name];
      if (!mapping) return;
      for (const [from, to] of Object.entries(mapping)) {
        if (path.scope.getBinding(from) && !path.scope.getBinding(to)) {
          path.scope.rename(from, to);
          counts.loaderRenames++;
        }
      }
    },
  });
}

// Remaining _0x names that are local to an eval/with-free lexical scope are
// renamed through Babel bindings. Public program-scope names are intentionally
// retained because classic scripts can expose them to outside callers.
function chooseLocalPrefix(binding) {
  const parent = binding.path.parentPath;
  if (parent && (parent.isFunctionDeclaration() || parent.isFunctionExpression() || parent.isArrowFunctionExpression())) return "argument";
  if (binding.path.parentPath && binding.path.parentPath.isVariableDeclarator()) {
    const init = binding.path.parentPath.get("init");
    if (init.isArrayExpression()) return "items";
    if (init.isObjectExpression()) return "options";
    if (init.isArrowFunctionExpression() || init.isFunctionExpression()) return "callback";
    if (init.isCallExpression() && init.get("callee").isMemberExpression() && init.get("callee.object").isIdentifier({ name: "document" }) && init.get("callee.property").isIdentifier({ name: "createElement" })) return "element";
  }
  return "localValue";
}
traverse(ast, {
  Scopable(path) {
    if (path.isProgram() || hasDynamicScopeAccess(path.scope.getFunctionParent() || (path.isFunction() ? path.scope : null))) return;
    for (const binding of Object.values(path.scope.bindings)) {
      const oldName = binding.identifier.name;
      if (!/^_0x/.test(oldName) || binding.scope !== path.scope) continue;
      const prefix = chooseLocalPrefix(binding);
      let ordinal = 1;
      let candidate = `${prefix}${ordinal}`;
      while (path.scope.hasBinding(candidate)) candidate = `${prefix}${++ordinal}`;
      path.scope.rename(oldName, candidate);
      counts.localRenames++;
    }
  },
});

const output = generate(ast, { comments: true, compact: false, concise: false, jsescOption: { minimal: true } }, source).code + "\n";
parser.parse(output, parseOptions);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);
fs.writeFileSync(reportPath, JSON.stringify({ inputPath, outputPath, sourceBytes: Buffer.byteLength(source), outputBytes: Buffer.byteLength(output), transformations: counts }, null, 2) + "\n");
