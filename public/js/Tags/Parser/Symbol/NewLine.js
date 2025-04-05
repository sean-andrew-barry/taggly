import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class NewLine extends Symbol
{
  // static GetLocalName(){ return "br"; }

  Parse(parser){ return parser.Read("\r\n"); }

  // Parse(parser)
  // {
  //   if (parser.Read("\n"))
  //   {
  //     if (parser.Read("\r"))
  //     {
  //       console.log("New line got a return");
  //     }
  //     return true;
  //   }
  //
  //   return false;
  // }
  // Text(){ return this; }
  // AppendText(){ return this; }

  Describe(){ return this.AddClass("new-line"); }
}
