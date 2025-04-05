import {Tag} from "/js/Tag.js";
import {Token} from "/js/Tags/Parser/Token.js";

export class Symbol extends Token
{
  static GetLocalName(){ return "symbol"; }

  // constructor()
  // {
  //   super();
  //   // this.AddClass(this.constructor.name);
  //   // this.Text(this.constructor.name);
  // }

  // Describe(){ return this.AddClass("symbol"); }
}
