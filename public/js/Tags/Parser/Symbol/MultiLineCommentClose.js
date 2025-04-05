import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class MultiLineCommentClose extends Symbol
{
  static GetLocalName(){ return "multi-line-comment-close"; }

  Parse(p){ return p.Read("*/"); }
}
