import {Tag} from "/js/Tag.js";

export class Select extends Tag
{
  static GetLocalName(){ return "select"; }
  static GetMetaURL(){ return import.meta.url; }

  GetSelection()
  {
    const node = this.GetNode();
    const index = node.selectedIndex;

    return node[index]?.tag;
  }
}
