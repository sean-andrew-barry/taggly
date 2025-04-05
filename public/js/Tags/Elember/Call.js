import {Tag} from "/js/Tag.js";

export class Call extends Tag
{
  Connect(parent)
  {
    const name = this.GetAttribute("name");

    let parameters;
    if (this.parameters)
    {
      parameters = this.parameters.map(p =>
      {
        const tag = this.Select(p);
        if (tag) return tag.GetResult();
        else return p;
      });
    }
    else
    {
      parameters = [];
    }

    const fn = parent[name];
    if (typeof(fn) === "function")
    {
      console.log("Connecting Call", name, parameters);
      const result = fn.apply(parent, parameters);
      this.SetResult(result);
      super.Connect(parent);
    }
  }

  Connect(parent)
  {
    const name = this.GetAttribute("name");
    const target = parent.Select(this.GetAttribute("target"));
    console.log("Call target is:", target);

    const fn = target[name];
    if (typeof(fn) === "function")
    {
      console.log("Connecting Call", name, this.GetText());
      const result = fn.call(target, this.GetText());
      this.SetResult(result);
      // super.Connect(parent);
    }
  }

  Parameters(...parameters)
  {
    this.parameters = parameters;
    return this.SetAttribute("parameters", parameters.join(", "));
  }
}

Call.Register({
  name: "Name",
  parameters: "Parameters",
});
