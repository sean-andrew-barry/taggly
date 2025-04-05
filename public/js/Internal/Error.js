// import "/flag#internal";

// import {ErrorParser} from "/js/External/ErrorParser.js";
// import {StringBuilder} from "/js/Utility/StringBuilder.js";
import {String} from "/js/String.js";
import {console} from "/js/Console.js";

const GlobalError = globalThis.Error;

export class Error extends GlobalError
{
  static Encode(buffer, value)
  {
    // Encode it directly as a string
    String.Encode(buffer, value.message);
  }

  static Decode(buffer)
  {
    const message = String.Decode(buffer);
    const error = new GlobalError(message);

    return error;
  }

  static Quote(value){ return `"${value}"`; }
  static Name(value){ return this.Quote(value); }
  static Value(value){ return `value ${this.Name(value)}`; }
  static Parameter(value){ return `parameter ${this.Name(value)}`; }
  static Instance(value){ return `an instance of ${value?.constructor?.name}`; }
  
  static Type(value)
  {
    switch (typeof(value))
    {
      case "undefined": return `undefined`;
      case "string": return `a string`;
      case "number": return `a number`;
      case "bigint": return `a big int`;
      case "boolean": return `a boolean`;
      case "symbol": return `a symbol`;
      case "function": return `a function`;
      case "object": return value === null ? `null` : "an object";
      default: return `a ${typeof(value)}`;
    }
  }

  static MergeStringAndValue(string, value)
  {
    if (value === undefined) return string;

    switch (string.at(-1))
    {
      case "Q": return string.slice(0, -1) + this.Quote(value);
      case "N": return string.slice(0, -1) + this.Name(value);
      case "V": return string.slice(0, -1) + this.Value(value);
      case "T": return string.slice(0, -1) + this.Type(value);
      case "P": return string.slice(0, -1) + this.Parameter(value);
      case "I": return string.slice(0, -1) + this.Instance(value);
      default: return string + value;
    }
  }
  
  static Format(strings, ...values)
  {
    let result = "";
    for (let i = 0; i < strings.length; i++)
    {
      result += this.MergeStringAndValue(strings[i], values[i]);
    }
  
    return result;
  }

  static Throw(...args)
  {
    const message = this.Format(...args);
    throw new this(message);
    // console.log("Pseudo throw:", message);
  }

  #name;
  Name(name){ this.#name = name; return this; }
  GetName(){ return this.#name ?? this.name; }

  #type;
  Type(type){ this.#type = type; return this; }
  GetType(){ return this.#type; }

  #value;
  Value(value){ this.#value = value; return this; }
  GetValue(){ return this.#value; }

  #stack;
  // Name(name){ this.#name = name; return this; }
  // GetStack(){ return this.#stack ??= this.name; }

  // constructor(...args)
  // {
  //   super(...args);
  // }

  constructor(message, {
    cause,
    ...rest
  } = {})
  {
    // Always set the default message to undefined so that our message getter will be called
    if (!cause) super(message);
    else super(message, { cause });

    // Copy each key/value pair to this object
    for (const key in rest)
    {
      this[key] = rest[key];
    }
  }

  CreateStack()
  {
    if (this.cause) return ErrorParser(this.cause);
    else return ErrorParser(this);
  }

  GetName(){ return this.name; }
  GetCause(){ return this.cause; }
  GetMessage(){ return this.message; }
  GetHelp(){ return; }
  GetStack(){ return this.#stack ??= this.CreateStack(); }
  IsFatal(){ return false; }

  toString()
  {
    console.log("Error.toString");
    return super.toString();
  }

  // toSource()
  // {
  //   console.log("Error.toSource");
  //   return super.toSource();
  // }
  //
  // toJSON()
  // {
  //   console.log("Error.toJSON");
  //   return super.toJSON();
  // }
}
