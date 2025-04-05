import {Tag} from "/js/Tag.js";

export class ForIn extends Tag
{
  Connect(parent)
  {
    const target = this.GetTarget();
    const result = target.GetResult();

    this.Expect(result).Named("result").ToBeValidObject();

    const limit = this.HasAttribute("limit");

    // Iterate the object and invoke Connect for each value
    for (const key in result)
    {
      if (!limit && !result.hasOwnProperty(key)) continue;

      this.SetResult(result[key]);
      super.Connect(parent);
    }
  }

  // An attribute that controls if the inherited properties are iterated or not
  Limit(v){ return this.ToggleAttribute("limit", v); }
}

ForIn.Register({
  limit: "Limit",
});
