import { Reference } from "/js/Reference.js";
import { Cyrb } from "/js/External/HashCyrb53.js";

// export * from "/js/Objects.js";
// export * from "/js/Tags.js";
// export * from "/js/Models.js";
// export * from "/js/Functions.js";
// export * from "/js/Symbols.js";
// export * from "/js/Strings.js";
import * as Objects from "/js/Objects.js";
import * as Symbols from "/js/Symbols.js";
import * as Strings from "/js/Strings.js";
import * as Functions from "/js/Functions.js";
import * as Tags from "/js/Tags.js";
import * as Models from "/js/Models.js";

let code = 0;
let fingerprint = 0;

function Register(mod_name, mod, type)
{
  for (const name of Object.getOwnPropertyNames(mod))
  {
    const value = mod[name];
    const reference = Reference.Get(value);

    reference.Register(mod_name, name, code++, type);

    fingerprint = Cyrb.Hash53(reference.GetName(), fingerprint);
  }
}

Register("Objects", Objects, true);
Register("Symbols", Symbols, false);
Register("Strings", Strings, false);
Register("Functions", Functions, false);
Register("Tags", Tags, true);
Register("Models", Models, true);