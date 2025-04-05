import {Tag} from "/js/Tag.js";

export const APPEND = Symbol("append");

export class Property extends Tag
{
  static GetNodeName(){ return "property"; }

  [APPEND](tag)
  {
    this.AppendChild(tag);
    return tag;
  }

  TypeOf(value){ return this.SetAttribute("typeof", value); }
  InstanceOf(value){ return this.SetAttribute("instanceof", value.name); }
  Description(text){ return this[APPEND](Tag.Description().Text(text)); }
  Example(text){ return this[APPEND](Tag.Example().Text(text)); }
}
