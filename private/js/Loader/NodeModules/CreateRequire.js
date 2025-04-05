import "/flag#dangerous";
import "/flag#internal";
import "/flag#volatile";

import {CreateContext} from "/js/Loader/NodeModules/CreateContext.js";

export const CreateRequire = CreateContext({
  name: "Packages",
  url: "/",
  path: "/",
  trusted: true,
  commonjs: true,
  allow_code_generation: true,
});