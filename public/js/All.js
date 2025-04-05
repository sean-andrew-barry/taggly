// export * from "/js/Interface.js";
// export * from "/js/Tags.js";
// export * from "/js/Objects.js";
// export * from "/js/Functions.js";
// export * from "/js/Strings.js";
// export * from "/js/Symbols.js";

export * as Interface from "/js/Interface.js";
export * as Tags from "/js/Tags.js";
export * as Objects from "/js/Objects.js";
export * as Functions from "/js/Functions.js";
export * as Strings from "/js/Strings.js";
export * as Symbols from "/js/Symbols.js";

import {Code} from "/js/Internal/Code.js";

export const codes = {};

import * as Self from "/js/All.js";
// console.log(Self);

let code = 0;
const seen = new WeakSet();
function GenerateCodes(module)
{
  const object = {};

  for (const name of Object.getOwnPropertyNames(module))
  {
    // object[name] = code++;
    object[name] = new Code(module, name);
  }

  // if (Object.getPrototypeOf(module) === null)
  // {
    
  // }

  return object;
}

for (const name of Object.getOwnPropertyNames(Self))
{
  codes[name] = GenerateCodes(Self[name]);
}

console.log(codes);