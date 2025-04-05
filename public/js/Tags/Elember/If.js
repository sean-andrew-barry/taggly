import {Tag} from "/js/Tag.js";

export class If extends Tag
{
  Test(value)
  {
    if (value === this.HasAttribute("not"))
    {
      this.SetResult(false);
      return false;
    }
    else
    {
      this.SetResult(true);
      return true;
    }
  }

  Connect(parent)
  {
    const target = this.GetTarget();
    const result = target.GetResult();

    if (this.HasAttribute("typeof"))
    {
      this.Test(typeof(result) === this.GetAttribute("typeof"));
    }

    if (this.GetResult() === true)
    {
      console.log("If Condition passed all tests!");
      super.Connect(parent);
    }
  }

  // Evaluate(value)
  // {
  //   if (value === this.HasAttribute("not"))
  //   {
  //     // this.SetResult(false);
  //     return false;
  //   }
  //   else
  //   {
  //     // this.SetResult(true);
  //     return true;
  //   }
  // }

  // Test(target)
  // {
  //   if (this.HasAttribute("typeof"))
  //   {
  //     const result = this.Test(typeof(target) === this.GetAttribute("typeof"));
  //     if (!result) return false;
  //   }
  //
  //   return true;
  // }

  Run(parent, target)
  {
    this.SetResult(undefined);

    const result = target.GetResult();

    if (this.HasAttribute("typeof"))
    {
      this.Test(typeof(result) === this.GetAttribute("typeof"));
    }

    if (this.GetResult() === true)
    {
      console.log(this.constructor.name, "passed", target.GetNode());
      super.Run(parent, target, false);
    }
    else // Failed
    {
      console.log(this.constructor.name, "failed!");
    }
  }

  Not(v){ return this.ToggleAttribute("not", v); }
  TypeOf(v){ return this.SetAttribute("typeof", v); }
  IsString(v){ return this.SetAttribute("is_string", v); }
  IsNumber(v){ return this.SetAttribute("is_number", v); }
  IsObject(v){ return this.SetAttribute("is_object", v); }
}

If.Register({
  target: "Target",
  not: "Not",
  typeof: "TypeOf",
  is_string: "IsString",
  is_number: "IsNumber",
  is_object: "IsObject",
});
