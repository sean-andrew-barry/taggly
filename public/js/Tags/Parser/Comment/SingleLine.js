import {Comment} from "/js/Tags/Parser/Comment.js";
import {SingleLineComment} from "/js/Tags/Parser/Symbol/SingleLineComment.js";

export class SingleLine extends Comment
{
  Parse(parser)
  {
    if (!parser.Match(SingleLineComment)) return false;

    let text = "";
    while (!parser.IsNewLine())
    {
      if (parser.IsDone()) return false;
      text += parser.Take();
    }

    // console.log(`Comment text: "${text}", raw: ${JSON.stringify(text)}`);
    this.AppendText(text);

    return true;
  }

  Describe(){ return this.AddClass("single-line"); }
}
