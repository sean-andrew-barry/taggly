import {Comment} from "/js/Tags/Parser/Comment.js";
import {MultiLineCommentOpen} from "/js/Tags/Parser/Symbol/MultiLineCommentOpen.js";
import {MultiLineCommentClose} from "/js/Tags/Parser/Symbol/MultiLineCommentClose.js";

export class MultiLine extends Comment
{
  Parse(parser)
  {
    if (!parser.Match(MultiLineCommentOpen)) return false;

    while (!parser.Match(MultiLineCommentClose))
    {
      if (parser.IsDone()) return false;
      this.AppendText(parser.Take());
    }

    return true;
  }

  Describe(){ return this.AddClass("multi-line"); }
}
