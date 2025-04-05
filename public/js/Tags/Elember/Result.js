import {Tag} from "/js/Tag.js";

export class Result extends Tag
{
  Connect(parent)
  {
    this.Clear();

    const target = this.GetTarget();
    const result = target.GetResult();

    console.log(target, "Connecting result", result);

    super.Connect(parent);

    if (result)
    {
      if (this.HasAttribute("key"))
      {
        const key = this.GetAttribute("key");
        const tag = this.Convert(result.GetAttribute(key) || result[key]);
        if (tag) this.AppendChild(tag);
      }
      else
      {
        const tag = this.Convert(result);
        if (tag) this.AppendChild(tag);
      }
    }
  }

  Key(v){ return this.SetAttribute("key", v); }
}

Result.Register({
  key: "Key",
  target: "Target",
});
