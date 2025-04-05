import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";
import {Script} from "/js/Tags/Script.js";
import {Error} from "/js/Tags/Error.js";
import {Connect} from "/js/Event/Connect.js";
import {Environment} from "/js/Environment.js";
import {PromiseUtilities} from "/js/Utility/Promise.js";

const CACHE = {};
const SYMBOL_NAME = "__importer_tag";
const SYMBOL = Symbol.for(SYMBOL_NAME); // Create a symbol that is globally accessible

// Create global access to the CACHE object
Object.defineProperty(window, SYMBOL, {
  value: CACHE,
  enumerable: false,
  configurable: false,
  writable: false,
});

let importer;
export class Import extends Tag
{
  static GetLocalName(){ return "import"; }
  static GetMetaURL(){ return import.meta.url; }

  static CreateImporter()
  {
    try
    {
      // If the browser supports dynamic imports, return a function that performs an import
      // If they are not supported, the "import" statement will cause a syntax error
      return new Function("specifier", "return import(specifier)");
    }
    catch (error)
    {
      return (specifier) =>
      {
        return new Promise((resolve, reject) =>
        {
          const url = new URL(specifier, window.location);
          const href = url.href;

          // Check if we have a cached module for this url
          if (CACHE[href])
          {
            resolve(CACHE[href]);
            return;
          }

          const blob = new window.Blob([
            `import * as module from "${href}";`, // Perform the import statically
            `const symbol = Symbol.for("${SYMBOL_NAME}");` // Load the symbol
            `window[symbol]["${specifier}"] = module;`, // "export" the module by adding it to the CACHE
          ], { type: "text/javascript" });

          const src = URL.createObjectURL(blob);

          const script = new Script()
          .Type("module")
          .SetAttribute("defer", "defer")
          .Src(src)
          .OnError(error =>
          {
            URL.revokeObjectURL(src);
            if (script.IsInPage()) script.Remove();
            reject(new Error(`Failed to import a module from "${specifier}" because ${error}`));
          })
          .OnLoad(e =>
          {
            URL.revokeObjectURL(src);
            if (script.IsInDocument()) script.Remove();

            resolve(CACHE[specifier]);
          });

          // Add the script to the document
          window.document.head.appendChild(script.GetNode());
        });
      };
    }
  }

  static GetImporter(){ return importer ??= this.CreateImporter(); }

  constructor(src)
  {
    super();

    if (src !== undefined)
    {
      this.Src(src);
    }
  }

  async Call()
  {
    const src = this.GetAttribute("src");

    const importer = await this.constructor.GetImporter();
    return importer(src);
  }

  async [Connect](event)
  {
    if (this.IsDisabled()) return;
    if (this.HasChildren()) return;

    if (this.HasAttribute("load"))
    {
      const load = this.GetAttribute("load");
      if (load === "client" &&  Environment.IsServer()) return;
      if (load === "server" &&  Environment.IsClient()) return;
      if (load === "inline" && !Environment.IsInlineFrame()) return;
    }

    if (this.HasAttribute("development") && !Environment.IsDevelopment())
    {
      return;
    }

    if (this.HasAttribute("delay"))
    {
      const delay = this.GetAttribute("delay");
      await PromiseUtilities.Sleep(delay);
    }

    if (this.HasAttribute("queue"))
    {
      await PromiseUtilities.AwaitBackgroundTask();
    }

    try
    {
      // Invoke the function with this tag as its argument and add the results to the fragment
      const mod = await this.Call();

      for (const key in mod)
      {
        this.Add(mod[key]);
      }
    }
    catch (error)
    {
      // Construct an Error tag to be added as a child
      this.Add(new Error(error));
    }
  }

  Load(v){ return this.SetAttribute("load", v); }
  Client(){ return this.Load("client"); }
  Server(){ return this.Load("server"); }
  Inline(){ return this.Load("inline"); }
  Delay(v = 100){ return this.SetAttribute("delay", v); }
  Queue(v = true){ return this.ToggleAttribute("queue", v); }
  Development(v = true){ return this.ToggleAttribute("development", v); }
}
