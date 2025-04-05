import {Token} from "/js/Parser/Token.js";

export class WhiteSpace extends Token
{
  Parse(p)
  {
    let matched = false;
    while (p.IsParsing())
    {
      const c = p.Current();
      if (p.IsSpace(c))
      {
        matched = true;
        this.Add(c);
        p.Next();
      }
      else
      {
        break;
      }
    }

    return matched === true;
  }
}
