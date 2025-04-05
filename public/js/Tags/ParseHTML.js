import {Tag} from "/js/Tag.js";

export const RANGE = Symbol("range");

export class ParseHTML
{
  static GetNodeName(){ return "parse-html"; }

  static GetRange(){ return this[RANGE] || (this[RANGE] = global.IsServer() ? undefined : window.document.createRange()); }

  constructor(node, html)
  {
    super(node);

    if (!global.IsServer())
    {
      // Create a fragment with the HTML, and wrap its contents, which will construct it as a tag
      this.fragment = this.constructor.GetRange().createContextualFragment(html);
      this.constructor.Wrap(this.fragment);
    }
  }

  Connect(parent)
  {
    // parent.ReplaceChild(this, this.fragment);
    parent.GetNode().replaceChild(this.fragment, this.GetNode());
  }
}
