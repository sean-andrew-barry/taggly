import {Tag} from "/js/Tag.js";

export class Ref extends Tag
{
  static GetNodeName(){ return "ref"; }

  constructor(node, selector)
  {
    if (selector === undefined && node && node.hasAttribute("selector"))
    {
      selector = node.getAttribute("selector");
    }

    super(node).SetAttribute("selector", selector);
    this.selector = selector;
  }

  Initialize()
  {
    const selector = this.GetAttribute("selector");

    if (this.HasAttribute("root"))
    {
      const root = Tag.Query(this.GetAttribute("root"));
      this.Expect(root).Named("root").ToBeInstanceOf(Tag);

      this.tag = root.Query(selector);
    }
    else
    {
      this.tag = Tag.Query(selector);
    }

    if (!this.tag)
    {
      throw new Error(`Failed to select a tag with ref "${selector}"`);
    }

    return super.Initialize();
  }

  Root(root){ return this.SetAttribute("root", root); }
}
