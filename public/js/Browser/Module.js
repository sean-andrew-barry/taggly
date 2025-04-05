console.log("Hi from Module.js", import.meta.url);
const SELF_URL = new window.URL(import.meta.url);

const CACHE = {};
const SYMBOL_NAME = "__taggly_importer_cache";
const SYMBOL = Symbol.for(SYMBOL_NAME); // Create a symbol that is globally accessible

// Create global access to the CACHE object
Object.defineProperty(window, SYMBOL, {
  value: CACHE,
  enumerable: false,
  configurable: false,
  writable: false,
});

function CreateImporter()
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
        const url = new window.URL(specifier, window.location);
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

        const src = window.URL.createObjectURL(blob);

        const script = window.document.createElement("script");
        script.setAttribute("type", "module");
        script.setAttribute("defer", "defer");
        script.setAttribute("src", src);

        script.addEventListener("error", error =>
        {
          window.URL.revokeObjectURL(src);

          if (window.document.contains(script))
          {
            script.remove();
          }

          reject(new Error(`Failed to import a module from "${specifier}" because ${error}`));
        });

        script.addEventListener("load", error =>
        {
          window.URL.revokeObjectURL(src);

          if (window.document.contains(script))
          {
            script.remove();
          }

          resolve(CACHE[specifier]);
        });

        // Add the script to the document
        window.document.head.appendChild(script);
      });
    };
  }
}

const ENTRY_URL = new window.URL(`/js/Start.js${SELF_URL.search ?? ""}`, SELF_URL)

const importer = CreateImporter();

importer(ENTRY_URL.href)
.then(mod =>
{
  console.log("Finished loading");
})
.catch(error =>
{
  console.log("Import error", error);
});

// // Create global access to the Importer object so it can be used by the Import tag
// Object.defineProperty(window, Symbol.for("__taggly_importer_function"), {
//   value: importer,
//   enumerable: false,
//   configurable: false,
//   writable: false,
// });

// import("${entry}")
// .then(mod => console.log("Finished loading"))
// .catch(error => console.error("Failed to load", error));
