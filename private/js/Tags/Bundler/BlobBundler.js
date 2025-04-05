// This file is essentially just my notes and experiments with an idea
// It is not meant to be valid code or anything and shouldn't be imported

export class BlobBundler
{
  static Compile()
  {
    const SPECIFIERS = new Map();

    function resolve(specifier)
    {
      return SPECIFIERS.get(specifier);
    }

    function mod(strings, ...specifiers)
    {
      // const last = strings.pop();
      const specifier = specifiers.pop();
      // console.log(strings, specifier, specifiers);
      console.log("Compiling", specifier);

      SPECIFIERS.set(specifier, new Promise(async (resolve, reject) =>
      {
        try
        {
          const parts = [];

          const length = Math.max(strings.length, specifiers.length);
          // const length = specifiers.length;

          for (let i = 0; i < length; i++)
          {
            const text = strings[i];
            const spec = (await resolve(specifiers[i])) ?? "UNDEFINED";

            console.log("~spec", spec);

            parts.push(text);
            parts.push(spec);
          }

          parts.push(strings[strings.length - 1]);

          console.log(parts.join(""));
          resolve("blob:https:localhost:3000/etc");
        }
        catch (error)
        {
          reject(error);
        }
      }));
    }

    // const sleep = new Promise(resolve => globalThis.setTimeout(resolve, 1));

    let RESOLVE;
    const done = new Promise(res => RESOLVE = res);

    function compile(strings, ...specifiers)
    {
      return function(specifier)
      {
        console.log("Compile inner", specifier, specifiers);

        SPECIFIERS.set(specifier, new Promise(async (resolve, reject) =>
        {
          await done;

          const parts = [];

          const length = Math.max(strings.length, specifiers.length);

          for (let i = 0; i < length; i++)
          {
            const text = strings[i];
            const spec = specifiers[i];

            parts.push(text);

            if (spec !== undefined)
            {
              if (SPECIFIERS.has(spec))
              {
                parts.push(await SPECIFIERS.get(spec));
              }
              else
              {
                console.error("No specifier found for", spec);
                parts.push(spec);
              }
            }
          }

          const result = parts.join("");

          // Create a Blob out of the result and resolve its URL
          console.log(result);

          resolve(`blob:https:localhost:3000${specifier}`);
        }));
      }
    }

    compile`import Environment from "${"/js/Environment.initialize.js"}";
    import Main from "${"/js/Main.js"}";
    import {Document} from "${"/js/Tags/Document.js"}";

    Promise.resolve(Main())
    .then(result =>
    {
      Environment.Done();
    })
    .catch(error =>
    {
      throw error;
    });`("/js/Start.js");

    compile`export class Document extends Tag {}`("/js/Tags/Document.js");

    compile`export default {};`("/js/Environment.initialize.js");
    compile`export default {};`("/js/Main.js");
    compile`export const window = globalThis.window;
    export const document = globalThis.window.document;`("/js/Window.js");

    RESOLVE();
  }

  static async GetEntrySource(entry, specifier)
  {
    let text = await entry.Read();

    text += `const Main = await import("/js/Main.js")`;

    // Match the import keyword, optional whitespace, open (, anything, close )
    text = text.replaceAll(/import(\w*\(.*\))/g, (match, p1) =>
    {
      console.log(p1);
      return `globalThis[globalThis.Symbol.for("dynamic")]${p1}`;
    });

    text = text.replaceAll(/(import.+)"(.+)"/g, (match, p1, p2) =>
    {
      console.log(p1, p2);
      return `${p1}"\${"${p2}"}"`;
    });

    let source = `\n\n// Module: ${specifier}\nmod\``;
    for (let i = 0; i < text.length; i++)
    {
      const c = text[i];

      if (c === "`")
      {
        source += entry.Escape(c);
      }
      else
      {
        source += c;
      }
    }
    source += `\`;("${specifier}")`;

    return source;
  }

  static async Compile()
  {
    const {Loader} = await import("/js/Loader.js");
    const domains = ["public"];

    const specifier = "/js/Start.js";
    const start = await Loader.Query(specifier, domains);

    let source = "";

    source += await this.GetEntrySource(start, specifier);

    console.log("Compiled", source);
  }

  static Encode(c)
  {
    const code = c.charCodeAt();
    const hex = code.toString(16);

    // If the code is small enough, use the more compact hexadecimal
    // escape sequence. Otherwise use a unicode escape sequence.
    if      (16 > code) return "\\x0" + hex;
    else if (256 > code) return "\\x" + hex;
    else if (4096 > code) return "\\u0" + hex;
    else if (65536 > code) return "\\u" + hex;
    else return `\\u{${hex}}`;
  }

  static Escape(c)
  {
    switch (c)
    {
      // As far as I know, these should be all of the reserved characters in a JavaScript string
      case "\0":
      case "\b":
      case "\f":
      case "\n":
      case "\r":
      case "\t":
      case "\v":
      case "\'":
      case "\`":
      case "\"":
      case "\\": return this.Encode(c);
      default: return c; // No need to encode it
    }
  }
}

const SPECIFIERS = new Map();

const SPECS = [
  "/js/Utility/String.js",
  "/js/Utility/Promise.js",
  "/js/Utility/Symbol.js",
  "/js/Environment.js",
  "/js/Window.js",
  "/js/Start.js",
];

const LOADED = new Promise((resolve, reject) =>
{
  window.addEventListener("DOMContentLoaded", event =>
  {
    resolve(event);
  }, { once: true });
});

async function require(specifier)
{
  if (SPECIFIERS.has(specifier))
  {
    return SPECIFIERS.get(specifier);
  }
  else
  {
    await LOADED;

    return SPECIFIERS.get(specifier);
  }
}

let index = 0;
function mod(strings, ...specifiers)
{
  const specifier = SPECS[index++];

  console.log("Compile", specifier);

  SPECIFIERS.set(specifier, new Promise(async (resolve, reject) =>
  {
    let code = "";

    const length = Math.max(strings.length, specifiers.length);

    for (let i = 0; i < length; i++)
    {
      code += strings[i];

      const spec = await require(specifiers[i]);
      if (!spec) throw new Error(`Module "${specifier}" failed to import "${specifiers[i]}"`);

      code += spec;
    }

    // Create a Blob out of the code and resolve its URL
    console.log(code);

    resolve(`blob:https:localhost:3000${specifier}`);
  }));
}

mod`import {window} from "${5}";`;
mod`import {window} from "${5}";`;

mod`import {StringUtilities} from "${"/js/Utility/String.js"}";
import {SymbolUtilities} from "${"/js/Utility/Symbol.js"}";
import {PromiseUtilities} from "${"/js/Utility/Promise.js"}";
import {Environment} from "${"/js/Environment.js"}";
import NodeSwap from "${"/js/External/NodeSwap.js"}";
import {Base} from "${"/js/Tag/Base.js"}";
import {window} from "${"/js/Window.js"}";`("/js/Tag.js");

mod`import Environment from "${"/js/Environment.initialize.js"}";
import Main from "${"/js/Main.js"}";

Promise.resolve(Main())
.then(result =>
{
  Environment.Done();
})
.catch(error =>
{
  throw error;
});`("/js/Start.js");




import {Script} from "/js/Tags/Script.js";

function CreateModule(...lines)
{
  const blob = new Blob(lines, { type: "text/javascript" });

  const src = URL.createObjectURL(blob);

  const script = new Script()
  .Type("module")
  .SetAttribute("defer", "defer")
  .Src(src)
  .On("error", error =>
  {
    URL.revokeObjectURL(src);
    if (script.IsInPage()) script.Remove();
    throw new Error(`Failed to import a module from "${specifier}" because ${error}`);
  })
  .On("load", e =>
  {
    URL.revokeObjectURL(src);
    if (script.IsInDocument()) script.Remove();

    console.log("Loaded!");
  });

  console.log(blob);
  console.log(src);

  window.document.head.appendChild(script.GetNode());

  return src;
}

// import "loader:push?url=/png/encoding_icon.png";

async function BundlerTest()
{
  console.log("Bundling?");

  const map = new Map();
  // map.set("/js/Tag.js", );

  const src1 = await CreateModule(
    `console.log("Hi from Module 1");`,
    `export default { value: 42.7 };`,
  );

  const src2 = await CreateModule(
    `import value from "${src1}";`,
    `import value from "$\{\}";`,
    `import {Script} from "https://localhost:3111/js/Tags/Script.js";`,
    `console.log("Hi from Module 2", value, Script);`,
  );

  // const start = Loader.Get().root;
  // console.log(start);
  //
  // return;
  //
  // const entries = [start];
  // for (const entry of start.GetImports())
  // {
  //   const blob = new Blob([
  //     `import * as module from "${href}";`, // Perform the import statically
  //     `const symbol = Symbol.for("${SYMBOL_NAME}");` // Load the symbol
  //     `window[symbol]["${specifier}"] = module;`, // "export" the module by adding it to the CACHE
  //   ], { type: "text/javascript" });
  // }
}
