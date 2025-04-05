import "/flag#dangerous";
import "/flag#internal";
import "/flag#volatile";

import {fileURLToPath} from "node:url";
// import {CreateContext} from "/js/Loader/NodeModules/CreateContext.js";
import {CreateRequire} from "/js/Loader/NodeModules/CreateRequire.js";

const url = new URL(import.meta.url);
const name = url.searchParams.get("name");
const source = url.searchParams.get("source");
const path = fileURLToPath(source);

// const CreateRequire = CreateContext({
//   name,
//   url: source,
//   path,
//   trusted: true,
//   commonjs: true,
//   allow_code_generation: true,
// });

const require = CreateRequire(undefined, name, source, path);

export default require(path);

// console.log("Resolve", process.cwd(), name, source);