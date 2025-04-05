import {StringUtilities} from "/js/Utility/String.js";

export const PARENTS = new WeakMap();
export const DESCRIPTORS = new WeakMap();
export const PROPERTY_NAMES = new WeakMap();
export const STATIC_PROPERTY_NAMES = new WeakMap();
export const HASHES = new WeakMap();

export let codes = 0;
// No global for this by default, so provide access
export const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;
export const TypedArray = Object.getPrototypeOf(Uint8Array);

export class ObjectUtilities
{
  static Mix(base, ...mixins)
  {
    return mixins.reduce((c, mixin) => mixin(c), base);
  }

  static Invert(self, keys = Object.keys(self))
  {
    const result = {};

    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = self[key];

      result[val] = key;
    }

    return result;
  }

  static Compare(self, other)
  {
    if (other === null) return false;
    if (self.constructor !== other.constructor) return false;

    const keys_a = Object.keys(self);
    const keys_b = Object.keys(other);

    if (keys_a.length !== keys_b.length) return false;

    for (let i = 0; i < keys_a.length; i++)
    {
      const key = keys_a[i];
      if (!other.hasOwnProperty(key)) return false;

      const a = self[key];
      const b = other[key];

      if (a !== b)
      {
        const fn = a[COMPARE];
        if ((typeof(fn) !== "function") || (fn.call(a, b) !== true))
        {
          return false;
        }
      }
    }

    for (let i = 0; i < keys_b.length; i++)
    {
      const key = keys_b[i];
      if (!self.hasOwnProperty(key)) return false;

      const a = other[key];
      const b = self[key];

      if (a !== b)
      {
        const fn = a[COMPARE];
        if ((typeof(fn) !== "function") || (fn.call(a, b) !== true))
        {
          return false;
        }
      }
    }

    return true;
  }

  static GetConstructor(self, value)
  {
    if (value === undefined) return Undefined;
    else if (value === null) return Null;
    else if (value.constructor === self.constructor) return This;
    else if (value.prototype instanceof Object) return value;
    else return value.constructor;
  }

  static GetSymbol(self, ctor)
  {
    switch (ctor)
    {
      case Undefined: return UNDEFINED;
      case Null: return NULL;
      case This: return THIS;
      case Object: return OBJECT;
      case Promise: return PROMISE;
      case window.URL: return URL;
      case Date: return DATE;
      case Number: return NUMBER;
      case Boolean: return BOOLEAN;
      case String: return STRING;
      case BigInt: return BIG_INT;
      case Symbol: return SYMBOL;
      case Function: return FUNCTION;
      case Int8Array: return INT_8_ARRAY;
      case Uint8Array: return UINT_8_ARRAY;
      case Uint8ClampedArray: return UINT_8_CLAMPED_ARRAY;
      case Int16Array: return INT_16_ARRAY;
      case Uint16Array: return UINT_16_ARRAY;
      case Int32Array: return INT_32_ARRAY;
      case Uint32Array: return UINT_32_ARRAY;
      case Float32Array: return FLOAT_32_ARRAY;
      case Float64Array: return FLOAT_64_ARRAY;
      case BigInt64Array: return BIG_INT_64_ARRAY;
      case BigUint64Array: return BIG_UINT_64_ARRAY;
      default: throw new Error(`No known symbol for ${ctor.name}`);
    }
  }

  static GetParent(fn)
  {
    if (PARENTS.has(fn))
    {
      return PARENTS.get(fn);
    }
    else
    {
      const parent = Object.getPrototypeOf(fn);
      PARENTS.set(fn, parent);

      return parent;
    }
  }

  static GetDescriptors(ctor)
  {
    if (DESCRIPTORS.has(ctor))
    {
      return DESCRIPTORS.get(ctor);
    }
    else
    {
      const descriptors = Object.getOwnPropertyDescriptors(ctor.prototype);
      DESCRIPTORS.set(ctor, descriptors);

      return descriptors;
    }
  }

  static GetPropertyNames(ctor)
  {
    if (PROPERTY_NAMES.has(ctor))
    {
      return PROPERTY_NAMES.get(ctor);
    }
    else
    {
      const names = Object.getOwnPropertyNames(ctor.prototype);
      PROPERTY_NAMES.set(ctor, names);

      return names;
    }
  }

  static GetStaticPropertyNames(ctor)
  {
    if (STATIC_PROPERTY_NAMES.has(ctor))
    {
      return STATIC_PROPERTY_NAMES.get(ctor);
    }
    else
    {
      const names = Object.getOwnPropertyNames(ctor);
      STATIC_PROPERTY_NAMES.set(ctor, names);

      return names;
    }
  }

  static GetClassHash(ctor, hasher = StringUtilities.HashCyrb53)
  {
    if (HASHES.has(ctor)) return HASHES.get(ctor);

    let hash = 0;
    const parent = this.GetParent(ctor);
    if (typeof(parent) === "function" && parent.name)
    {
      hash = this.GetClassHash(parent, hasher);
    }

    if (ctor.prototype)
    {
      const names = this.GetPropertyNames(ctor);
      for (let i = 0; i < names.length; i++)
      {
        let name = names[i];
        if (name === "constructor") name = ctor.name;

        hash = hasher(name, hash);
      }
    }
    else
    {
      hash = hasher(ctor.name, hash);
    }

    HASHES.set(ctor, hash);

    return hash;
  }

  // Return a ROUGH ESTIMATE of an object's size in bytes
  // TODO: Add Set, WeakSet, Map, WeakMap, SharedArrayBuffer, Date?, RegExp?
  static SizeOf(value, visited = new WeakSet())
  {
    switch (typeof(value))
    {
      case "undefined": return 8; // Unsure, seems like it should take SOME space, right? But people said 0
      case "string": return value.length * 2; // Each character should be 2 bytes
      case "boolean": return 4; // NOTE: Uhh is this right? Seems high, but that's what people said
      case "number": return 8; // I think it's 8 byte numbers by default
      case "symbol": return 8; // Purely a guess here, I have no source for this
      case "function": return 16; // Purely a guess here, I have no source for this
      case "object":
      {
        if (value === null) return 8; // Is null like a pointer?

        // Check for circular references
        // I'm assuming the reference takes 8 bytes (a pointer)
        if (visited.has(value)) return 8;
        else visited.add(value);

        if (value instanceof BigInt) return 16; // Uhh, no idea what this actually is, but it's gotta be larger than Number, right?
        else if (value instanceof ArrayBuffer) return value.byteLength + 16;
        else if (value instanceof TypedArray) return value.byteLength + 16;
        else if (value instanceof Array)
        {
          // I'm assuming the indexes do not take up space, as they shouldn't have to
          // and I'm assuming the base array is 16 bytes (8 for pointer, 8 for length)

          let bytes = 16;
          for (let i = 0; i < this.length; i++)
          {
            bytes += SizeOf(this[i], visited);
          }

          return bytes;
        }
        else
        {
          let bytes = 8; // Assume 8 for the object pointer

          // NOTE: Should I use Reflect.ownKeys() here instead? Much slower
          // const keys = Reflect.ownKeys(this);
          const keys = Object.keys(this);
          for (let i = 0; i < keys.length; i++)
          {
            const key = keys[i];
            const val = this[key];

            bytes += this.SizeOf(key, visited);
            bytes += this.SizeOf(val, visited);
          }

          return bytes;
        }
      }
      default: throw new Error(`Unknown type "${typeof(value)}" in SizeOf`);
    }
  }
}
