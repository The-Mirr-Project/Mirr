import { parseScript } from "meriyah";
import { walk } from "estree-walker";
import { generate } from "astring";

const pairs = {
  fetch: "$mirr$fetch",
  location: "$mirr$location",
  open: "$mirr$open",
  navigator: "$mirr$navigator",
  history: "$mirr$history",
  eval: "$mirr$eval"
};

const globals = ["window", "globalThis", "top"];

function rewriteJavascript(code) {
  const ast = parseScript(code, { next: true, loc: false });
  const aliases = new Map(); // aliases for globals and such
  walk(ast, {
    enter(node, parent) {
      // track aliases
      if (node.type === "DebuggerStatement") {
        this.remove();
        return
      };

      if (
        node.type === "VariableDeclarator" &&
        node.init?.type === "Identifier" &&
        globals.includes(node.init.name)
      ) {
        aliases.set(node.id.name, node.init.name);
        return;
      }

      // skip it if it shouldnt be rewritten
      if (node.type === "Identifier" && Object.hasOwn(pairs, node.name)) {
        const isDeclaration =
          (parent?.type === "VariableDeclarator" && parent.id === node) ||
          (parent?.type === "FunctionDeclaration" && parent.id === node) ||
          (parent?.type === "FunctionExpression" && parent.id === node) ||
          (parent?.type === "ClassDeclaration" && parent.id === node) ||
          (parent?.type === "ClassExpression" && parent.id === node) ||
          parent?.type === "ImportSpecifier" ||
          parent?.type === "ImportDefaultSpecifier" ||
          parent?.type === "ImportNamespaceSpecifier" ||
          parent?.type === "ExportSpecifier" ||
          (parent?.type === "Property" &&
            parent.key === node &&
            !parent.computed) ||
          parent?.type === "ObjectPattern" ||
          (parent?.type === "Property" &&
            parent.parent?.type === "ObjectPattern");

        if (!isDeclaration) {
          node.name = pairs[node.name];
        }
        return;
      }

      // window.location, globalThis.open, etc.
      if (
        node.type === "MemberExpression" &&
        !node.computed &&
        node.object.type === "Identifier" &&
        node.property.type === "Identifier"
      ) {
        const name = aliases.get(node.object.name) || node.object.name;
        const prop = node.property.name;

        if (globals.includes(name) && Object.hasOwn(pairs, prop)) {
          this.replace({
            type: "Identifier",
            name: pairs[prop],
          });
        }
        return;
      }

      // Rewrite w["location"] → $mirr$location
      if (
        node.type === "MemberExpression" &&
        node.computed &&
        node.object.type === "Identifier" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
      ) {
        const name = aliases.get(node.object.name) || node.object.name;
        const prop = node.property.value;

        if (globals.includes(name) && Object.hasOwn(pairs, prop)) {
          this.replace({
            type: "Identifier",
            name: pairs[prop],
          });
        }
      }
    },
  });

  return generate(ast);
}

export default rewriteJavascript;
