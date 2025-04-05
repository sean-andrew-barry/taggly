import {Token} from "/js/Parser/Token.js";

export class Skip extends Token
{
  Parse(p)
  {
    this.Add(p.Take());
    return p;
  }
}
