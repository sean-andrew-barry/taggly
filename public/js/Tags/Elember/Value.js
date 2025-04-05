import {Tag} from "/js/Tag.js";

export class Value extends Tag
{
  constructor(node)
  {
    super(node);
  }

  Connect(parent)
  {
    this.Clear();

    const name = this.GetAttribute("name");
    const target = parent.Select(this.GetAttribute("target"));

    let value = target.GetResult();
    console.log("Value target is:", value);

    // // let value;
    // if (name && value)
    // {
    //   value = target.GetAttribute(name) || target[name];
    // }

    const tag = this.Convert(value);
    if (tag) this.AppendChild(tag);

    // const target = this.GetTarget();
    // const result = target.GetResult();
    //
    // console.log(target, "Connecting result", result);
    //
    // super.Connect(parent);
  }

  Slice(v){ return this.SetAttribute("slice", v); }
}

Value.Register();
