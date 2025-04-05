import {String} from "/js/String.js";

const SYMBOL = globalThis.Symbol;

export class Symbol extends SYMBOL
{
  static Encode(buffer, value)
  {
    String.Encode(buffer, value.description);
  }

  static Decode(buffer)
  {
    const description = String.Decode(buffer);
    return SYMBOL(description);
  }

  // static get [SYMBOL.species]()
  // {
  //   console.log("Get species");
  //   return SYMBOL;
  // }

  // static [SYMBOL.hasInstance](instance)
  // {
  //   console.log("Symbol is instance?", instance);
  //   return true;
  //
  //   if (instance === SYMBOL)
  //   {
  //     return true;
  //   }
  //
  //   return false;
  // }

  // #symbol;
  // constructor(description)
  // {
  //   this.#symbol = SYMBOL(description);
  // }
  //
  // get description(){ return this.#symbol.description; }
  //
  // [SYMBOL.toPrimitive](hint)
  // {
  //   console.log("toPrimitive", hint);
  //   return this.#symbol;
  // }
  //
  // [SYMBOL.toStringTag]()
  // {
  //   console.log("toStringTag");
  //   return this.#symbol;
  // }
}

// export function SymbolTest(description)
// {
// }
//
// SymbolTest.for = function(description)
// {
// }
//
// SymbolTest.Encode = function(buffer, value)
// {
//   String.Encode(buffer, value.description);
// }
//
// SymbolTest.Decode = function(buffer, value)
// {
//   const description = String.Decode(buffer);
//   return SYMBOL(description);
// }

// const s1 = new Symbol("Hello");
// console.log(s1, s1 instanceof SYMBOL);

// const s2 = SymbolTest("Hello");
// console.log(s2);

Symbol.toNode = SYMBOL.for("toNode");
Symbol.toTag = SYMBOL.for("toTag");
