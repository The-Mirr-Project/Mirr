import { parseScript } from "meriyah";
import { walk } from "estree-walker";
import { generate } from "astring";

const pairs = {
  fetch: "$mirr$fetch", // fetch is already monkeypatched but just for reasons, this is a good idea
  location: "$mirr$location", // sandboxing purposes 
  open: "$mirr$open", // sandboxing purposes 
  navigator: "$mirr$navigator", // sandboxing + anti fingerprinting purposes 
  history: "$mirr$history", // this is purely for asthetics 
  eval: "$mirr$eval", // if eval is accessed, any random code can be run so usually its a great idea to not
};

const globals = ["window", "globalThis", "top", "parent", "self"]; // please make an issue if im missing something here i dont want leaks

export default function rewriteJavascript(code) {
  const ast = parseScript(code, { next: true, loc: false });
  const aliases = new Map(); // aliases for globals and such
  
  walk(ast, {
    enter(node, parent) {
      // since some sites use debuggers to be a pain in the ass, remove them
      if (node.type === "DebuggerStatement") {
        this.replace({ type: "EmptyStatement" });
        return;
      }

      // track aliases ( const x = window; for example)
      if (
        node.type === "VariableDeclarator" &&
        node.init?.type === "Identifier" &&
        globals.includes(node.init.name)
      ) {
        aliases.set(node.id.name, node.init.name);
        return;
      }

      // function calls (fetch -> $mirr$fetch, for example)
      if (node.type === "CallExpression") {
        if (node.callee.type === "Identifier") {
          const name = node.callee.name;
          const original = aliases.get(name) || name;
          if (globals.includes(original) && Object.hasOwn(pairs, original)) {
            node.callee.name = pairs[original];
          }
        } else if (
          node.callee.type === "MemberExpression" &&
          !node.callee.computed &&
          node.callee.object.type === "Identifier"
        ) {
          const base =
            aliases.get(node.callee.object.name) || node.callee.object.name;
          const prop = node.callee.property.name;
          if (globals.includes(base) && Object.hasOwn(pairs, prop)) {
            node.callee.property.name = pairs[prop];
          }
        }
        return;
      }

      // Rewrite identifiers only if they are globals or aliases
      if (node.type === "Identifier") {
        const original = aliases.get(node.name) || node.name;
        if (Object.hasOwn(pairs, original)) {
          const isDeclaration =
            (parent?.type === "VariableDeclarator" && parent.id === node) ||
            (parent?.type === "FunctionDeclaration" && parent.id === node) ||
            (parent?.type === "FunctionExpression" && parent.id === node) ||
            (parent?.type === "ClassDeclaration" && parent.id === node) ||
            (parent?.type === "ClassExpression" && parent.id === node) ||
            parent?.type?.startsWith("Import") ||
            parent?.type?.startsWith("Export") ||
            (parent?.type === "Property" &&
              parent.key === node &&
              !parent.computed) ||
            parent?.type === "ObjectPattern";

          if (!isDeclaration && globals.includes(original)) {
            node.name = pairs[original];
          }
        }
        return;
      }

      // rewrite *ONLY* if base is a global
      if (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier"
      ) {
        const base = aliases.get(node.object.name) || node.object.name;

        // window.open -> $mirr$open
        if (!node.computed && node.property.type === "Identifier") {
          const prop = node.property.name;
          if (globals.includes(base) && Object.hasOwn(pairs, prop)) {
            node.property.name = pairs[prop];
          }
        }

        // window["open"] -> $mirr$open
        if (
          node.computed &&
          node.property.type === "Literal" &&
          typeof node.property.value === "string"
        ) {
          const prop = node.property.value;
          if (globals.includes(base) && Object.hasOwn(pairs, prop)) {
            this.replace({ type: "Identifier", name: pairs[prop] });
          }
        }
      }
    },
  });

  return generate(ast);
}
