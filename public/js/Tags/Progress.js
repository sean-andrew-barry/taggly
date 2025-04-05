import {Tag} from "/js/Tag.js";

const FORMATTER = new Intl.NumberFormat();

export class Progress extends Tag
{
  static GetLocalName(){ return "progress"; }
  static GetMetaURL(){ return import.meta.url; }

  Percent(value, max)
  {
    const percent = (value / max) * 100;
    this.Value(percent);
    this.Max(100);
    this.Text(FORMATTER.format(percent) + "%");
    return this;
  }
}
