import "/flag#dangerous";
import "/flag#internal";
import "/flag#volatile";

import {fileURLToPath} from "node:url";
import {CreateContext} from "/js/Loader/NodeModules/CreateContext.js";

const url = new URL(import.meta.url);
const name = url.searchParams.get("name");
const source = url.searchParams.get("source");
const path = fileURLToPath(source);

const require = CreateContext({
  name,
  url: source,
  path,
  trusted: true,
  commonjs: true,
  allow_code_generation: true,
});

export default require(path);

// console.log("Test", process.cwd(), name, source);