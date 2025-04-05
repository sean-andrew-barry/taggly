import {Token} from "/js/Token.js";

// This just represents a section of the string
export class Text extends Token
{
  Format(builder)
  {
    builder.NL(`${this.GetName()}<${this.GetStart()}, ${this.GetEnd()}>: "${this.GetText()}"`);
  }
}