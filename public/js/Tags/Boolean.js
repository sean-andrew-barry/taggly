import {Tag} from "/js/Tag.js";

export class Boolean extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "boolean"; }

  constructor(value)
  {
    super();

    if (typeof(value) !== "boolean")
    {
      this.Value(value);
    }
  }

  Deconvert(){ return this.GetValue(); }

  toJSON()
  {
    return [
      "boolean",
      [this.GetValue()],
    ];
  }
}
