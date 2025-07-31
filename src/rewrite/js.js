import { parseScript } from "meriyah";
import { walk } from "estree-walker";
import { generate } from "astring";

const pairs = {
  fetch: "$mirr$fetch",
  location: "$mirr$location",
  open: "$mirr$open",
  navigator: "$mirr$navigator",
  history: "$mirr$history",
};

function rewriteJavascript(code) {
  const ast = parseScript(code, { next: true, loc: false });

  walk(ast, {
    enter(node, parent) {
      // plain identifiers (fetch - $mirr$fetch, location - mirr$locaion, etc)
      if (node.type == "Identifier") {
        const name = node.name;
        if (!Object.hasOwn(pairs, name)) return;

        // dont touch declarations
        if (
          (parent?.type == "VariableDeclarator" && parent.id == node) ||
          (parent?.type == "FunctionDeclaration" && parent.id == node) ||
          (parent?.type == "FunctionExpression" && parent.id == node) ||
          (parent?.type == "ClassDeclaration" && parent.id == node) ||
          (parent?.type == "ClassExpression" && parent.id == node) ||
          (parent?.type == "Property" &&
            parent.key == node &&
            !parent.computed) ||
          parent?.type == "ImportSpecifier" ||
          parent?.type == "ObjectPattern" ||
          (parent?.type == "Property" && parent.parent?.type == "ObjectPattern")
        ) {
          return;
        }

        node.name = pairs[name];
      }

      // global identifiers for now are window globalthis and top. im probably missing like 4 lol
      if (
        node.type == "MemberExpression" &&
        !node.computed &&
        node.object.type == "Identifier" &&
        ["window", "globalThis", "top"].includes(node.object.name) &&
        node.property.type == "Identifier"
      ) {
        const name = node.property.name;
        if (Object.hasOwn(pairs, name)) {
          node.type = "Identifier";
          node.name = pairs[name];
          delete node.object;
          delete node.property;
        }
      }
    },
  });

  return generate(ast);
}

export default rewriteJavascript;
