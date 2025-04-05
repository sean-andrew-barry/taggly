import {Sequence} from "/js/Token/CSS/Sequence.js";
import {WhiteSpace} from "/js/Token/Text/WhiteSpace.js";
import {MultiLineComment} from "/js/Token/Comment/MultiLineComment.js";

export class MultiLineCommentSequence extends Sequence
{
  Parse()
  {
    try
    {
      while (true)
      {
        if (!this.IsParsing())
        {
          throw new Error(`Unexpected end of file`);
        }

        if (this.IsSpaceAt())
        {
          this.Match(WhiteSpace);
        }

        if (!this.Match(MultiLineComment))
        {
          break;
        }
      }
      
      return this.HasChildren(); // True if we actually matched anything
    }
    catch (error)
    {
      console.error("Caught", error);
    }
  }
}