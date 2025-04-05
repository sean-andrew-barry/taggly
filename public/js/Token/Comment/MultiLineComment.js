import {Comment} from "/js/Token/Comment.js";
import {OpenMultiLineCommentSymbol, CloseMultiLineCommentSymbol} from "/js/Token/Text/Symbol.js";
import {Text} from "/js/Token/Text.js";

export class MultiLineComment extends Comment
{
  Parse()
  {
    if (!this.Match(OpenMultiLineCommentSymbol)) return false;

    const text = new Text(this);

    while (!(text.Peek(0) === "*" && text.Peek(1) === "/"))
    {
      if (!text.IsParsing())
      {
        throw new Error(`Unexpected end of file`);
      }

      text.Step();
    }

    this.Append(text);

    return this.Match(CloseMultiLineCommentSymbol);
  }
}