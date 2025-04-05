import {Expression} from "/js/Token/CSS/Expression.js";
import {NumberLiteral} from "/js/Token/Literal/NumberLiteral.js";
import {NKeyword, EvenKeyword, OddKeyword} from "/js/Token/CSS/Keyword/Keyword.js";
import {AddSymbol, SubSymbol} from "/js/Token/Text/Symbol.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";

export class NthExpression extends Expression
{
  MatchAnB()
  {
    console.log("matching AnB", this.Peek());

    // Match 'a' value if exists, though it might just be a single integer
    if (this.Match(NumberLiteral))
    {
      console.log("Matched NumberLiteral");

      this.Optional(WhiteSpace);

      // Match 'n' keyword
      if (this.Match(NKeyword))
      {
        this.Optional(WhiteSpace);

        // Handle 'b' value
        if (this.Match(AddSymbol) || this.Match(SubSymbol))
        {
          this.Optional(WhiteSpace);

          if (this.Match(NumberLiteral))
          {
            this.Optional(WhiteSpace);
          }
        }
      }

      return true;
    }

    return false;
  }

  Parse()
  {
    // Check for the 'even' or 'odd' keyword
    if (this.Match(EvenKeyword)) return true;
    if (this.Match(OddKeyword)) return true;

    // Check for an+b format
    return this.MatchAnB();
  }
}
