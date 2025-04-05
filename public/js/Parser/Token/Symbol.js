import {Token} from "/js/Parser/Token.js";

export class Symbol extends Token
{
}

// Some common keywords that are used in a variety of parsers
export class OpenParenthesis extends Symbol { Parse(p){ return p.Read("("); } }
export class CloseParenthesis extends Symbol { Parse(p){ return p.Read(")"); } }
export class OpenCurlyBracket extends Symbol { Parse(p){ return p.Read("{"); } }
export class CloseCurlyBracket extends Symbol { Parse(p){ return p.Read("}"); } }
export class OpenBracket extends Symbol { Parse(p){ return p.Read("["); } }
export class CloseBracket extends Symbol { Parse(p){ return p.Read("]"); } }
export class Colon extends Symbol { Parse(p){ return p.Read(":"); } }
export class SemiColon extends Symbol { Parse(p){ return p.Read(";"); } }
export class Dot extends Symbol { Parse(p){ return p.Read("."); } }
export class Asterisk extends Symbol { Parse(p){ return p.Read("*"); } }
export class Hash extends Symbol { Parse(p){ return p.Read("#"); } }
export class Comma extends Symbol { Parse(p){ return p.Read(","); } }
export class Percent extends Symbol { Parse(p){ return p.Read("%"); } }
export class SingleQuote extends Symbol { Parse(p){ return p.Read("'"); } }
export class DoubleQuote extends Symbol { Parse(p){ return p.Read("\""); } }
export class SingleLineComment extends Symbol { Parse(p){ return p.Read("//"); } }
export class OpenMultiLineComment extends Symbol { Parse(p){ return p.Read("/*"); } }
export class CloseMultiLineComment extends Symbol { Parse(p){ return p.Read("*/"); } }
export class Assign extends Symbol { Parse(p){ return p.Read("="); } }
export class Equal extends Symbol { Parse(p){ return p.Read("=="); } }
export class NotEqual extends Symbol { Parse(p){ return p.Read("!="); } }
export class Not extends Symbol { Parse(p){ return p.Read("!"); } }
export class Or extends Symbol { Parse(p){ return p.Read("||"); } }
export class And extends Symbol { Parse(p){ return p.Read("&&"); } }
export class Increment extends Symbol { Parse(p){ return p.Read("++"); } }
export class Decrement extends Symbol { Parse(p){ return p.Read("--"); } }
export class Add extends Symbol { Parse(p){ return p.Read("+"); } }
export class Sub extends Symbol { Parse(p){ return p.Read("-"); } }
export class Mul extends Symbol { Parse(p){ return p.Read("*"); } }
export class Div extends Symbol { Parse(p){ return p.Read("/"); } }
export class Mod extends Symbol { Parse(p){ return p.Read("%"); } }
export class AddAssign extends Symbol { Parse(p){ return p.Read("+="); } }
export class SubAssign extends Symbol { Parse(p){ return p.Read("-="); } }
export class MulAssign extends Symbol { Parse(p){ return p.Read("*="); } }
export class DivAssign extends Symbol { Parse(p){ return p.Read("/="); } }
export class ModAssign extends Symbol { Parse(p){ return p.Read("%="); } }
