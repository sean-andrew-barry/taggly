import {Tag} from "/js/Tag.js";

export class Slot extends Tag
{
  static GetLocalName(){ return "slot"; }
  static GetMetaURL(){ return import.meta.url; }

  GetAssignedNodes(){ return this.GetNode().assignedNodes(); }
  GetAssignedElements(){ return this.GetNode().assignedElements(); }

  Mode(mode){ return this.SetAttribute("mode", mode); }
  ModeAppend(){ return this.Mode("append"); }
  ModePrepend(){ return this.Mode("prepend"); }
  ModeReplace(){ return this.Mode("replace"); }
  ModeBefore(){ return this.Mode("before"); }
  ModeAfter(){ return this.Mode("after"); }

  Load(tag)
  {
    // tag = this.Convert(tag);

    switch (this.GetAttribute("mode"))
    {
      case "replace": return this.Replace(tag);
      case "append": return this.AppendChild(tag);
      case "prepend": return this.PrependChild(tag);
      case "before": return this.Before(tag);
      case "after": return this.After(tag);
      default: return this.Clear().AppendChild(tag);
    }
  }
}
