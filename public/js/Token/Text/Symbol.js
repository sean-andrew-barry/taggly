import {Text} from "/js/Token/Text.js";

export class Symbol extends Text
{
  Parse()
  {
    const value = this.Value();
    const start = this.GetPosition();
    const length = value.length;
    const string = this.GetString();

    // If the input string would extend beyond the parser string, it cannot match
    if (length > (string.length - start)) return false;

    for (let i = 0; i < length; i++)
    {
      let c = string[start + i];

      // If the sequence is at all different, return
      if (c !== value[i]) return false;
    }

    this.Walk(length);

    return true;
  }
}

export class OpenParenthesisSymbol extends Symbol { Value(){ return "("; } }
export class CloseParenthesisSymbol extends Symbol { Value(){ return ")"; } }
export class OpenBraceSymbol extends Symbol { Value(){ return "{"; } }
export class CloseBraceSymbol extends Symbol { Value(){ return "}"; } }
export class OpenBracketSymbol extends Symbol { Value(){ return "["; } }
export class CloseBracketSymbol extends Symbol { Value(){ return "]"; } }
export class ColonSymbol extends Symbol { Value(){ return ":"; } }
export class DoubleColonSymbol extends Symbol { Value(){ return "::"; } }
export class SemiColonSymbol extends Symbol { Value(){ return ";"; } }
export class LessThanSymbol extends Symbol { Value(){ return "<"; } }
export class GreaterThanSymbol extends Symbol { Value(){ return ">"; } }
export class LessThanEqualSymbol extends Symbol { Value(){ return "<="; } }
export class GreaterThanEqualSymbol extends Symbol { Value(){ return ">="; } }
export class DotSymbol extends Symbol { Value(){ return "."; } }
export class TildeSymbol extends Symbol { Value(){ return "~"; } }
export class AsteriskSymbol extends Symbol { Value(){ return "*"; } }
export class HashSymbol extends Symbol { Value(){ return "#"; } }
export class CommaSymbol extends Symbol { Value(){ return ","; } }
export class PercentSymbol extends Symbol { Value(){ return "%"; } }
export class BarSymbol extends Symbol { Value(){ return "|"; } }
export class SingleQuoteSymbol extends Symbol { Value(){ return "'"; } }
export class DoubleQuoteSymbol extends Symbol { Value(){ return "\""; } }
export class SingleLineCommentSymbol extends Symbol { Value(){ return "//"; } }
export class OpenMultiLineCommentSymbol extends Symbol { Value(){ return "/*"; } }
export class CloseMultiLineCommentSymbol extends Symbol { Value(){ return "*/"; } }
export class AssignSymbol extends Symbol { Value(){ return "="; } }
export class EqualSymbol extends Symbol { Value(){ return "=="; } }
export class ExactEqualSymbol extends Symbol { Value(){ return "==="; } }
export class NotEqualSymbol extends Symbol { Value(){ return "!="; } }
export class NotSymbol extends Symbol { Value(){ return "!"; } }
export class OrSymbol extends Symbol { Value(){ return "||"; } }
export class AndSymbol extends Symbol { Value(){ return "&&"; } }
export class IncrementSymbol extends Symbol { Value(){ return "++"; } }
export class DecrementSymbol extends Symbol { Value(){ return "--"; } }
export class AddSymbol extends Symbol { Value(){ return "+"; } }
export class SubSymbol extends Symbol { Value(){ return "-"; } }
export class MulSymbol extends Symbol { Value(){ return "*"; } }
export class DivSymbol extends Symbol { Value(){ return "/"; } }
export class ModSymbol extends Symbol { Value(){ return "%"; } }
export class DolSymbol extends Symbol { Value(){ return "$"; } }
export class AddAssignSymbol extends Symbol { Value(){ return "+="; } }
export class SubAssignSymbol extends Symbol { Value(){ return "-="; } }
export class MulAssignSymbol extends Symbol { Value(){ return "*="; } }
export class DivAssignSymbol extends Symbol { Value(){ return "/="; } }
export class ModAssignSymbol extends Symbol { Value(){ return "%="; } }
export class XorAssignSymbol extends Symbol { Value(){ return "^="; } }
export class DolAssignSymbol extends Symbol { Value(){ return "$="; } }
export class TilAssignSymbol extends Symbol { Value(){ return "~="; } }
export class BarAssignSymbol extends Symbol { Value(){ return "|="; } }