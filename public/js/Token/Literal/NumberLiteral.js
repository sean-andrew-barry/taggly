import {Literal} from "/js/Token/Literal.js";

export class NumberLiteral extends Literal {
  #value;

  InvalidDigits(digits)
  {
    return digits === "-"
        || digits === "."
        || digits === "-."
        || digits.endsWith("E")
        || digits.endsWith("e")
        || digits.endsWith("E-")
        || digits.endsWith("E+")
        || digits.endsWith("e-")
        || digits.endsWith("e+");
  }

  Parse()
  {
    let digits = "";
    let decimal_point_encountered = false;
    let e_encountered = false;
    let exponent_sign_encountered = false;
    
    while (this.IsParsing())
    {
      const c = this.Peek();

      if (c === ".")
      {
        if (decimal_point_encountered || e_encountered) break;
        decimal_point_encountered = true;
      }
      else if (c === "E" || c === "e")
      {
        if (e_encountered) break;
        e_encountered = true;
        decimal_point_encountered = true; // No more decimal points allowed after "E"
      }
      else if ((c === "+" || c === "-") && e_encountered && !exponent_sign_encountered)
      {
        exponent_sign_encountered = true;
      }
      else if (!this.IsDigit(c))
      {
        break;
      }

      digits += c;
      this.Step();
    }
    
    if (this.InvalidDigits(digits))
    {
      throw new Error(`Invalid NumberLiteral digits "${digits}"`);
    }
    
    const value = Number(digits);
    if (Number.isNaN(value)) return false;

    this.#value = value;

    return true;
  }

  GetText(){ return this.#value; }
  GetValue(){ return this.#value; }
}
