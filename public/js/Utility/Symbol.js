const SYMBOLS = new WeakMap();

class Undefined
{

}

class Null
{

}

class This
{

}

export class SymbolUtilities
{
  static GetSymbolsSet(){ return SYMBOLS; }
  static GetUndefinedClass(){ return Undefined; }
  static GetNullClass(){ return Null; }
  static GetThisClass(){ return This; }

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
        throw new Error(`GetSymbol must be given an object or a function`);
      }
    }
  }

  static GetSymbol(value)
  {
    value = this.ToFunction(value);

    if (SYMBOLS.has(value))
    {
      return SYMBOLS.get(value);
    }
    else
    {
      const symbol = Symbol(value.name);
      SYMBOLS.set(value, symbol);

      return symbol;
    }
  }

  static SetSymbol(object, symbol = Symbol(object.name))
  {
    SYMBOLS.set(object, symbol);
    return symbol;
  }
}
