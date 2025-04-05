import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Selection extends Singelton
{
  static GetLocalName(){ return "selection"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor()
  {
    super();
    this.selection = window.getSelection();
  }

  IsCollapsed(){ return this.selection.isCollapsed; }
  GetRangeCount(){ return this.selection.rangeCount; }
  GetType(){ return this.selection.type; }
  IsType(type){ return this.GetType() === type; }
  IsTypeNone(){ return this.IsType("None"); }
  IsTypeCaret(){ return this.IsType("Caret"); }
  IsTypeRange(){ return this.IsType("Range"); }

  Contains(tag){ return this.selection.containsNode(tag.GetNode()); }
  Empty(){ this.selection.empty(); return this; }
  RemoveAllRanges(){ this.selection.removeAllRanges(); return this; }
  Extend(tag, offset){ this.selection.extend(tag.GetNode(), offset); return this; }
  Collapse(tag, offset){ this.selection.collapse(tag.GetNode(), offset); return this; }
  CollapseToStart(){ this.selection.collapseToStart(); return this; }
  CollapseToEnd(){ this.selection.collapseToEnd(); return this; }
  AddRange(range){ this.selection.addRange(range); return this; }

  GetAnchorOffset(){ return this.selection.anchorOffset; }
  GetFocusOffset(){ return this.selection.focusOffset; }
  GetAnchorNode(){ return this.selection.anchorNode; }
  GetFocusNode(){ return this.selection.focusNode; }
  GetAnchorTag(){ const n = this.GetAnchorNode(); if (n) return n.tag; }
  GetFocusTag(){ const n = this.GetFocusNode(); if (n) return n.tag; }

  toString(){ return this.selection.toString(); }
}
