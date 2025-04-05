import {Token} from "/js/Token.js";
import {MultiLineComment} from "/js/Token/Comment/MultiLineComment.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";

export class CSS extends Token
{
  MultiLineCommentSequence()
  {
    while (this.IsParsing() && (this.Match(MultiLineComment) || this.Match(WhiteSpace)))
    {
    }

    return true;
  }

  IsSpace(c = this.Peek())
  {
    switch (c.codePointAt(0))
    {
      case 0x09:   // \t
      case 0x0A:   // \n
      case 0x0C:   // \f
      case 0x0D:   // \r
      case 0x20:   // Space
      {
        return true;
      }
      default:
      {
        return false;
      }
    }
  }
}