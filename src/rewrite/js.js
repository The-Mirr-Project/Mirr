import { parseScript } from "meriyah";
import { walk } from "estree-walker";
import { generate } from "astring";

function rewriteJavascript(jsinput) {
  const ast = parseScript(jsinput);

  walk(ast, {
    enter(node) {
      // fetch -> $mirr$fetch
      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "fetch"
      ) {
        node.callee.name = "$mirr$fetch";
        return;
      }

      // window.* things
      if (
        node.type === "MemberExpression" &&
        !node.computed &&
        node.object.type === "Identifier" &&
        (node.object.name === "window" ||
          node.object.name == "top" ||
          node.object.name == "globalThis") &&
        node.property.type === "Identifier"
      ) {
        if (node.property.name === "location") {
          this.replace({
            type: "Identifier",
            name: "$mirr$location",
          });
          return;
        }
        if (node.property.name === "open") {
          this.replace({
            type: "Identifier",
            name: "$mirr$open",
          });
          return;
        }
      }

      // navigator  $mirr$navigator
      if (node.type === "Identifier" && node.name === "navigator") {
        node.name = "$mirr$navigator";
        return;
      }
    },
  });

  return generate(ast);
}

export default rewriteJavascript;
