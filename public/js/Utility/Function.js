import {ObjectUtilities} from "/js/Utility/Object.js";
import {StringUtilities} from "/js/Utility/String.js";
import {Undefined} from "/js/Utility/Undefined.js";
import {Null} from "/js/Utility/Null.js";

const HASHES = new Map();

export class FunctionUtilities
{
  static GetHashesMap(){ return HASHES; }

  static ConvertFunctionToString(fn)
  {
    return fn.toString();
  }

  static GetHasherStride(string)
  {
    // let stride = Math.acosh(string.length); // Decent, 11.9 to 4.9
    // let stride = Math.asinh(string.length); // Similar to above
    // let stride = Math.cbrt(string.length / 2); // Quite good, 4 - 42
    // let stride = Math.log(string.length); // Potential, 4.2 - 11.2
    // let stride = Math.log1p(string.length); // Potential, 4.2 - 11.2
    // let stride = Math.log10(string.length * 20); // Good, 1.8 - 4.87
    // let stride = Math.log2(string.length); // Okay, 6 - 16
    let stride = Math.sqrt(string.length / 10); // Potential, 8.3 - 274
    stride = Math.max(1, Math.round(stride));

    return stride;
  }

  static GetFunctionHash(fn, hasher = StringUtilities.HashCyrb53, hash = 0)
  {
    if (HASHES.has(fn)) return HASHES.get(fn);

    const string = this.ConvertFunctionToString(fn);
    const stride = this.GetHasherStride(string);

    if (fn.hasOwnProperty("prototype"))
    {
      // const parent = ObjectUtilities.GetParent(fn);
      // if (parent)
      // {
      //   hash ^= GetFunctionHash(parent, hasher);
      // }

      // const base = hash;
      const names = ObjectUtilities.GetPropertyNames(fn);
      for (let i = 0; i < names.length; i++)
      {
        const name = names[i];

        if (name === "constructor")
        {
          // console.log(string.length, "hashing with stride", stride);
          hash ^= hasher(string, hash, stride);
        }
        else
        {
          const description = Object.getOwnPropertyDescriptor(fn.prototype, name);

          if (description.hasOwnProperty("get")) continue;
          if (description.hasOwnProperty("set")) continue;
          if (typeof(description.value) !== "function") continue;

          hash ^= GetFunctionHash(description.value, hasher, hash);

          // hash ^= GetFunctionHash(fn.prototype[name], hasher, hash);
        }
      }
    }
    else
    {
      hash ^= hasher(string, hash, stride);
    }

    hash >>>= 0;

    if (HASHES.has(hash))
    {
      console.warn(fn.name, "with a stride of", stride, "hashed to", hash, "which is already being used by", HASHES.get(hash).name);
    }

    HASHES.set(fn, hash);
    HASHES.set(hash, fn);
    return hash;
  }

  static GetFunctionFromHash(hash)
  {
    if (HASHES.has(hash))
    {
      return HASHES.get(hash);
    }
    else
    {
      throw new Error(`No registered function for hash "${hash}"`);
    }
  }

  static Debounce(callback, delay)
  {
    let timeout;
    return function()
    {
      global.clearTimeout(timeout);
      timeout = global.setTimeout(callback, delay);
    }
  }

  static ToFunction(value)
  {
    switch (typeof(value))
    {
      case "string": return String;
      case "boolean": return Boolean;
      case "symbol": return Symbol;
      case "number": return Number;
      case "undefined": return Undefined;
      case "function": return value;
      case "object":
      {
        if (value === null) return Null;
        else return value.constructor;
      }
      default:
      {
        throw new Error(`ToFunction must be given an object or a function`);
      }
    }
  }
}
