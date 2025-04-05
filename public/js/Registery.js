// When the parent module is flagged as an aggregate, it means it CAN resolve
// against the optional domain. Whether it will or not depends on its settings
import "/loader#flag=aggregate";

import { Reference } from "/js/Reference.js";
import { Cyrb } from "/js/External/HashCyrb53.js";

import * as Natives from "/js/Natives.js";
import * as Symbols from "/js/Symbols.js";
import * as Strings from "/js/Strings.js";
import * as Functions from "/js/Functions.js";
// import * as Entries from "/js/FileSystem/Entries.js";
import * as Tags from "/js/Tags.js";
// import * as Models from "/js/Models.js";

let code = 0;
let fingerprint = 0;

function Register(mod_name, mod, type)
{
  for (const name of Object.getOwnPropertyNames(mod))
  {
    const value = mod[name];
    const reference = Reference.For(value);

    reference.Register(mod_name, name, code++, type);

    fingerprint = Cyrb.Hash53(reference.GetName(), fingerprint);
  }
}

// Reference.Register("Natives", );

Register("Natives", Natives);
Register("Values", { "undefined": undefined }, Natives.Undefined);
Register("Values", { "null": null }, Natives.Null);
Register("Symbols", Symbols, Natives.Symbol);
Register("Strings", Strings, Natives.String);
Register("Functions", Functions, Natives.Function);
Register("Tags", Tags);
// Register("Models", Models);