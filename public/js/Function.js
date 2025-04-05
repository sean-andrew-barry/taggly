import {Reference} from "/js/Reference.js";
import {Array} from "/js/Array.js";

const GlobalFunction = globalThis.Function;

// These constructors are not available as globals,
// but we can access them from an instance
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const GeneratorFunction = Object.getPrototypeOf(function* () { }).constructor;
const AsyncGeneratorFunction = Object.getPrototypeOf(async function* () { }).constructor;

const ONCE = new WeakMap();

export class Function extends GlobalFunction
{
  static IsAsync(fn) { return fn instanceof AsyncFunction; }
  static IsGenerator(fn) { return fn instanceof GeneratorFunction; }
  static IsAsyncGenerator(fn) { return fn instanceof AsyncGeneratorFunction; }

  static Encode(buffer, fn, ...args)
  {
    if (typeof(fn) !== "function")
    {
      throw new Error(`Expected fn to be a function`);
    }

    // console.log("Writing function", fn?.name ?? fn, args);

    const code = buffer.GetCodeFromInstance(fn);

    buffer.WriteCode(code);
    buffer.WriteArray(args);
  }

  static Decode(buffer, value)
  {
    if (typeof(value) !== "function")
    {
      throw new Error(`Expected decoded function to be a registered instance`);
    }

    const args = buffer.ReadArray();

    return function DecodedFunction()
    {
      return value.apply(this, args);
    };
  }

  static Encode(block, fn, ...args)
  {
    if (typeof(fn) !== "function")
    {
      throw new Error(`Expected fn to be a function`);
    }

    const reference = Reference.FromValue(fn);

    // console.log("Writing function", fn?.name ?? fn, args);

    const code = reference.GetCode();

    block.WriteU16(code);
    Array.Encode(block, args);
  }

  static Decode(block)
  {
    const code = block.ReadU16();
    const args = Array.Decode(block);

    const fn = Reference.FromCode(code);

    if (typeof(fn) !== "function")
    {
      throw new Error(`Expected fn to be a function`);
    }

    return function DecodedFunction()
    {
      return fn.apply(this, args);
    };
  }

  // Call the given function only one time and return the result
  static Once(fn, self, args)
  {
    if (!ONCE.has(fn)) 
    {
      if (args)
      {
        ONCE.set(fn, fn.apply(self, args));
      }
      else
      {
        ONCE.set(fn, fn.call(self));
      }
    }

    return ONCE.get(fn);
  }
}