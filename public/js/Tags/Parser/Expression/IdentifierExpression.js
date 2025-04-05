import {Tag} from "/js/Tag.js";
import {Expression} from "/js/Tags/Parser/Expression.js";
import {Identifier} from "/js/Tags/Parser/Identifier.js";
import {BracketOpen} from "/js/Tags/Parser/Symbol/BracketOpen.js";
import {BracketClose} from "/js/Tags/Parser/Symbol/BracketClose.js";

export class IdentifierExpression extends Expression
{
  Parse(parser)
  {
    // Match: [Expression]
    return p.Match(BracketOpen) && p.MatchExpression() && p.Match(BracketClose);
  }

  Describe(){ return this.AddClass("identifier"); }
}
