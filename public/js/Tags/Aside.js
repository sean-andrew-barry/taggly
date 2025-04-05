import {Tag} from "/js/Tag.js";

export class Aside extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "aside"; }

  Default()
  {
    return this
    .DisplayBlock()
    .PositionRelative()
    .Margin("1.7em 0")
    .Padding("1.3em 1.5em")
    .FontSize("0.9em")
    .LineHeight("1.5em");
  }

  Blue()
  {
    return this
    .Default()
    .Color("#34345b")
    .BorderLeft("0.3em solid #9980fa")
    .BackgroundColor("rgba(153, 128, 250, 0.09)");
  }
}
