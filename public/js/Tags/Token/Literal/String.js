import {Literal} from "/js/Tags/Token/Literal.js";

export class String extends Literal
{
  Parse(p)
  {
    let type;
    if      (p.Match(SingleQuote)) type = SingleQuote;
    else if (p.Match(DoubleQuote)) type = DoubleQuote;
    else return false;

    while (!p.Match(type))
    {
      if (p.IsDone()) return false;

      this.AppendText(p.Take());
    }

    return true;
  }
}
