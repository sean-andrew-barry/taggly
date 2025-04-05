let codes = 0;
const CODES = new Map();

export class Code
{
  static For(name, value)
  {
    if (CODES.has(value))
    {
      return CODES.get(value);
    }
    else
    {
      const code = new this(value);

      CODES.set(value, code);

      return code;
    }
  }

  static FromCode(code){}
  static FromSymbol(code){}
  static FromValue(code){}

  #code = codes++;
  #symbol;
  #value;

  constructor(name, value)
  {
    this.#value = value;
    this.#symbol = Symbol(value);
  }

  Property(name)
  {
    return this[name] ??= Symbol(name);
  }
}
