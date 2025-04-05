import "/flag#static";
import "/flag#frozen";
import "/flag#internal";
import "/flag#dangerous";

import {Data as DATA} from "/js/Loader/Data.js";

// The purpose of this file is to provide access to the loader, without having
// to import it as a dependency
export function Getter()
{
  if (!DATA.loader)
  {
    throw new Error(`The Data file doesn't have a loader. This usually means it got reloaded, so there's something wrong with the resolved URL.`);
  }

  return DATA.loader;
}
