import {Symbol} from "/js/Tags/Parser/Symbol.js";

export class MultiLineCommentOpen extends Symbol
{
  static GetLocalName(){ return "multi-line-comment-open"; }

  Parse(p){ return p.Read("/*"); }
}
