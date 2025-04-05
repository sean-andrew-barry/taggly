import {Tag} from "/js/Tag.js";

export class ForOf extends Tag
{
  Connect(parent)
  {
    const target = this.GetTarget();
    const result = target.GetResult();

    this.Expect(result).Named("result").ToBeIterable();

    super.Connect(parent);

    for (let value of result)
    {
      const tag = this.Convert(value);
      if (tag) this.AppendChild(tag);
    }
  }

  Connect(parent)
  {
    const target = parent.GetTarget();
    const result = target.GetResult();

    this.Expect(result).Named("result").ToBeIterable();

    // Iterate the object and invoke Connect for each value
    for (let value of result)
    {
      this.SetResult(value);
      super.Connect(parent);
    }
  }
}

ForOf.Register();
