import {Tag} from "/js/Tag.js";
import {Statement} from "/js/Tags/Parser/Statement.js";
import {Else as ElseKeyword} from "/js/Tags/Parser/Keyword/Else.js";

export class Else extends Statement
{
  static GetLocalName(){ return "else"; }

  Parse(p)
  {
    if (p.Match(ElseKeyword))
    {
      return p.MatchStatement();
    }

    return false;
  }

  // Describe(){ return this.AddClass("conditional", "controller"); }
}
