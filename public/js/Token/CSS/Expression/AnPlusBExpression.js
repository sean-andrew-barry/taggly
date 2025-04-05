import {Expression} from "/js/Token/CSS/Expression.js";
import {NumberLiteral} from "/js/Token/Literal/NumberLiteral.js";
import {NKeyword, EvenKeyword, OddKeyword} from "/js/Token/CSS/Keyword/Keyword.js";
import {AddSymbol, SubSymbol} from "/js/Token/Text/Symbol.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";

export class AnPlusBExpression extends Expression {
  Parse()
  {
    let aFound = false, nFound = false, bFound = false;

    // Match optional 'a' (NumberLiteral)
    if (this.Match(NumberLiteral)) {
      this.a = this.GetLastChild().GetValue();
      aFound = true;
    }

    // Match optional 'n' (NSymbol)
    if (this.Match(NSymbol)) {
      nFound = true;

      // If 'a' was not specified, it defaults to 1
      if (!aFound) {
        this.a = 1;
      }
    } else if (!aFound) {
      // No 'an' found, so we expect to find only 'b'
      nFound = false;
      aFound = false;
    }

    // Match optional '+' or '-' (AddSymbol or SubSymbol)
    let sign = 1;
    if (this.Match(AddSymbol)) {
      sign = 1;
    } else if (this.Match(SubSymbol)) {
      sign = -1;
    }

    // Match optional 'b' (NumberLiteral)
    if (this.Match(NumberLiteral)) {
      this.b = sign * this.GetLastChild().GetValue();
      bFound = true;
    }

    // If no 'b' was found, it defaults to 0
    if (!bFound) {
      this.b = 0;
    }

    // Return true if any of 'a', 'n', or 'b' was found
    return aFound || nFound || bFound;
  }
}
