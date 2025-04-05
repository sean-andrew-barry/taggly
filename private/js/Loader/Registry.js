// import "/flag#internal";
import "/flag#volatile";

import {Getter} from "/js/Loader/Getter.js";

const registry = new WeakMap();

export class Registry
{
  static Add(source, mod)
  {
    const loader = Getter();
    const entry = loader.Query(source);
    // if (entry.IsPublic())
    // {
    //   console.log("Registering", entry?.GetNormalized());
    // }
    // else
    // {
    //   console.log("Registering", entry?.GetNormalized());
    // }

    for (const key of Object.getOwnPropertyNames(mod))
    {
      const value = mod[key];
      switch (typeof(value))
      {
        case "object":
        case "function":
        {
          // console.log("Registered", source, mod[key]);
          registry.set(mod[key], source);
          break;
        }
      }
    }
  }
}
