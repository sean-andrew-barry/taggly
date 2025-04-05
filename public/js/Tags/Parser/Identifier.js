import {Tag} from "/js/Tag.js";
import {Token} from "/js/Tags/Parser/Token.js";

export class Identifier extends Token
{
  Parse(p)
  {
    const c = p.Next();
    if ((c !== "$") && (c !== "_") && !p.IsAlpha(c)) return false;

    const characters = [c];
    while (p.IsParsing())
    {
      const c = p.Current();
      if (c !== "_" && !p.IsAlNum(c)) break;

      characters.push(c);
      p.Next();
    }

    const id = characters.join("");
    this.Text(id);
    this.Name(id);

    return true;
  }

  // Describe(){ return this.AddClass("variable"); }
}
