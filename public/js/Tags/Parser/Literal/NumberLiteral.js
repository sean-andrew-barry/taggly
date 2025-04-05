import {Tag} from "/js/Tag.js";
import {Literal} from "/js/Tags/Parser/Literal.js";

export class NumberLiteral extends Literal
{
  Parse(p)
  {
    const c = p.Next();
    if (c !== "-" && !p.IsDigit(c)) return false;

    const digits = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "." && !p.IsDigit(c)) break;

      digits.push(c);
      p.Next();
    }

    const value = Number(digits.join(""));
    if (Number.isNaN(value)) return false;

    this.Value(value);
    this.Text(value.toString());

    return true;
  }

  Describe(){ return this.AddClass("constant", "numeric"); }
}
