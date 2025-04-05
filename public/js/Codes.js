import * as Objects from "/js/Objects.js";
import * as Tags from "/js/Tags.js";
import * as Models from "/js/Models.js";
import * as Functions from "/js/Functions.js";
import * as Symbols from "/js/Symbols.js";

// import { Strings } from "/js/Strings.js";
import * as Strings from "/js/Strings.js";
import {Cyrb} from "/js/External/HashCyrb53.js";
import {Function} from "/js/Function.js";
import {String} from "/js/String.js";
import {Symbol} from "/js/Symbol.js";

let code = 0;
let hash = 0;

function GenerateCodes(module)
{
  const codes = {};

  for (const name of Object.getOwnPropertyNames(module))
  {
    codes[name] = code++;
    hash = Cyrb.Hash53(name, hash);
  }

  // console.log("Generated codes", codes);

  return codes;
}

const ObjectsCodes = GenerateCodes(Objects);
const TagsCodes = GenerateCodes(Tags);
const ModelsCodes = GenerateCodes(Models);
const FunctionsCodes = GenerateCodes(Functions);
const SymbolsCodes = GenerateCodes(Symbols);
const StringsCodes = GenerateCodes(Strings);

const CODES = new Map();
const TYPES = new Map();

export class Codes
{
  static AddEach(map, object, codes, type)
  {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const value = object[key];
      const code = codes[key];
  
      // A single value can have multiple keys, so skip it if we've already seen it before
      if (map.has(value)) continue;
  
      // hash = Cyrb.Hash53(key, hash);
  
      map.set(code, value);
      map.set(value, code);
      CODES.set(code, value);

      if (type)
      {
        TYPES.set(value, type);
      }
    }
  }

  static CreateInstances()
  {
    // console.log("Creating instances");

    const map = new Map();

    this.AddEach(map, Functions, FunctionsCodes, Function);
    this.AddEach(map, Symbols, SymbolsCodes, Symbol);
    this.AddEach(map, Strings, StringsCodes, String);

    return map;
  }
  
  static CreateTypes()
  {
    // console.log("Creating types");

    const map = new Map();

    this.AddEach(map, Objects, ObjectsCodes);
    this.AddEach(map, Tags, TagsCodes);
    this.AddEach(map, Models, ModelsCodes);

    return map;
  }

  static GetInstances(){ return this.instances ??= this.CreateInstances(); }
  static GetTypes(){ return this.types ??= this.CreateTypes(); }

  static GetInstance(value){ return this.GetInstances().get(value); }
  static GetType(value){ return this.GetTypes().get(value); }
  static HasInstance(value){ return this.GetInstances().has(value); }
  static HasType(value){ return this.GetTypes().has(value); }
  static GetHash(){ return hash; }

  static get(value){ return this.GetTypes().get(value); }
  static has(value){ return this.GetTypes().has(value); }

  static GetCodeFromType(type){ return this.GetTypes().get(type); }
  static GetCodeFromInstance(instance){ return this.GetInstances().get(instance); }

  static GetTypeFromCode(code){ return this.GetCodes().get(code); }
  static GetTypeFromInstance(instance){ return TYPES.get(instance); }
  static GetInstanceFromCode(code){ return this.GetCodes().get(code); }
}