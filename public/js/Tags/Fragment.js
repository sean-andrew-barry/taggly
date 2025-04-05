import {Tag} from "/js/Tag.js";

export class Fragment extends Tag
{
  static GetLocalName(){ return "#document-fragment"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(fragment)
  {
    super();

    this.SetNode(this.constructor.CreateNodeFragment());
  }

  // SetNode(node = this.constructor.CreateFragment()){ return super.SetNode(node); }
}
