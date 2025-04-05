let counter = 0;
let pending = [];
const CODES = new Map();
const VALUES = new Map();

// NOTE: Don't auto register, because then we can't error when an unregistered
// value is requested

export class Code
{
  static RegisterValue(value, name)
  {
    if (VALUES.has(value)) return;

    const code = new this(value, name);
    VALUES.set(code);
  }

  static RegisterType(type)
  {
  }

  static Register(module, type)
  {
    for (const name of Object.getOwnPropertyNames(module))
    {
      try
      {
        const value = module[name];
        // console.log(name);
      }
      catch (error)
      {
        if (!(error instanceof ReferenceError))
        {
          throw error;
        }
        else
        {
          pending.push(module, name, type);
        }
      }
    }
  }

  static Populate()
  {
    const failed = [];

    while (pending.length > 0)
    {
      const type   = pending.pop();
      const name   = pending.pop();
      const module = pending.pop();

      try
      {
        const value = module[name];
      }
      catch (error)
      {
        if (error instanceof ReferenceError)
        {
          failed.push(module, name, type);
        }
        else
        {
          throw error;
        }
      }
    }

    pending = failed;
  }

  static HasCode(code){ return CODES.has(code); }
  static HasValue(value){ return VALUES.has(value); }

  static GetFromCode(code)
  {
    this.Populate();

    if (CODES.has(code)) return CODES.get(code);
    else throw new Error(`The code "${code}" is not registered`);
  }

  static GetFromValue(value)
  {
    this.Populate();

    if (VALUES.has(value)) return VALUES.get(value);
    else throw new Error(`The code "${value}" is not registered`);
  }

  static Hint(value, hint){ return this.For(value)[Symbol.toPrimitive](hint); }

  #module;
  #value;
  #type;
  #name;
  #code;
  #symbol;

  // constructor(value, type, name)
  // {
  //   this.#value = value;
  //   this.#type = type;
  //   this.#name = name ?? value?.[Symbol.toStringTag] ?? value?.name ?? value?.toString?.() ?? "UNKNOWN";
  //   this.#code = counter++;
  //   this.#symbol = globalThis.Symbol(this.#name);

  //   CODES.set(this.#code, this);
  //   VALUES.set(this, this.#code);
  // }

  constructor(module, name, type)
  {
    this.#module = module;
    // this.#value = value;
    this.#name = name;
    this.#type = type;
    this.#code = counter++;
    this.#symbol = globalThis.Symbol(this.#name);

    CODES.set(this.#code, this);
    // VALUES.set(this, this.#code);
  }

  // Encode(buffer, ...args)
  // {
  //   if (this.IsType())
  //   {
  //     buffer.WriteCode(this.#code);
  //   }

  //   return this.#type.Encode(buffer, ...args);
  // }

  // Decode(buffer)
  // {
  //   if (!this.IsType())
  //   {
  //     buffer.Advance(-2);
  //   }

  //   return this.#type.Encode(buffer, ...args);
  // }

  GetValue(){ return this.#value; }
  GetType(){ return this.#type; }
  GetName(){ return this.#name; }
  GetCode(){ return this.#code; }
  GetSymbol(){ return this.#symbol; }
  IsType(){ return this.#value === this.#type; }

  [Symbol.toPrimitive](hint)
  {
    switch (hint)
    {
      case "string": return this.#symbol;
      case "number": return this.#code;
      case "default": return this.#name;
      default: return this.#name;
    }
  }

  Hint(hint){ return this[Symbol.toPrimitive](hint); }
}