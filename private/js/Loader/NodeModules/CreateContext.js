// import "/flag#frozen";
// import "/flag#static";
import "/flag#dangerous";
import "/flag#internal";

import Module from "node:module";
import FS, {promises as FSP} from "node:fs";
import VM from "node:vm";
import Path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

import {Getter} from "/js/Loader/Getter.js";

let contextifier_code;

export function CreateContext({
  name,
  url,
  path,
  origin = url,
  // path = fileURLToPath(url),
  trusted = false,
  commonjs = false,
  host = globalThis,
  allow_code_generation = false,
  allow_code_generation_strings = allow_code_generation,
  allow_code_generation_wasm = allow_code_generation,
  code,
})
{
  console.log("Creating a new context", name, url, origin, path);

  try
  {
    const context = VM.createContext(undefined, {
      name,
      origin,
      codeGeneration: {
        strings: allow_code_generation_strings,
        wasm: allow_code_generation_wasm,
      },
    });

    const loader = Getter();
    const Contextifier = loader.Query("/js/Loader/NodeModules/Contextifier.js");

    if (!code)
    {
      contextifier_code ??= Contextifier.ReadSync();
      code = contextifier_code;
    }

    const require = new VM.Script(`(${code})`, {
      filename: Contextifier.HRef(),
    })
    .runInContext(context, {
      displayErrors: true,
    })
    .call(context, {
      host,
      name,
      Module,
      FS,
      VM,
      Path,
      url,
      path,
      trusted,
      commonjs,
      loader,
      fileURLToPath,
      pathToFileURL,
      context,
    });

    return require;
  }
  catch (error)
  {
    console.error("CreateContext error", error);
  }
};
