import {Tag} from "/js/Tag.js";
import {Text} from "/js/Tags/Text.js";
import {Connect} from "/js/Event/Connect.js";

let FORMATTER;
if (globalThis.Intl && globalThis.Intl.NumberFormat)
{
  FORMATTER = new globalThis.Intl.NumberFormat();
}

export class BigInt extends Tag
{
  static GetLocalName(){ return "bigint"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetFormatter(){ return FORMATTER; }

  constructor(value)
  {
    super();

    if (typeof(value) === "bigint")
    {
      this.Value(value);
    }
  }

  Text(text)
  {
    if (typeof(text) === "string")
    {
      text = new Text(text);
    }

    return this.Clear().AppendChild(text);
  }

  [Connect](event)
  {
    if (this.IsDisabled()) return; // Don't auto invoke
    if (this.HasChildren()) return;

    // console.log("Number Connect", this.GetValue());
    const text = this.Format();
    this.Text(text);
  }

  Deconvert(){ return this.value; }

  toJSON()
  {
    return [
      "bigint",
      [this.GetValue()],
    ];
  }
}
