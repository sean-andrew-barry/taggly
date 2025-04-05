import {Tag} from "/js/Tag.js";

// Tag.Class("User").Extends("#Model").Add(
//   Tag.Method("Email").Add(
//     Tag.Parameter("operator").IsDefined().IsString(),
//     Tag.Parameter("email").IsDefined().IsString(),
//     Tag.Call().Name("AddOperation").Parameters(".operator", ".email"),
//   ),
//   Tag.Method("Password").Add(
//     Tag.Parameter("operator").IsDefined().IsString(),
//     Tag.Parameter("password").IsDefined().IsString(),
//     Tag.Call().Name("AddOperation").Parameters(".operator", ".password"),
//   ),
// ),

export class Class extends Tag
{
  Connect(parent)
  {
    const name = this.GetAttribute("id") || "value";

    let superclass;
    if (this.GetResult())
    {
      super.Connect(parent, this.GetResult());
      return;
    }
    else if (this.HasAttribute("extends"))
    {
      const selector = this.GetAttribute("extends");
      const target = this.Select(selector);

      superclass = target.GetResult();

      this.Expect(superclass).Named("superclass").ToExtend(Tag);
    }
    else
    {
      superclass = Tag;
    }

    const result = new Function(superclass.name, `return class ${name} extends ${superclass.name}\n{\n\tconstructor(...args)\n\t{\n\t\tsuper(...args);\n\t}\n}`)(superclass);

    // console.log("Class result:", result);

    const template = this.Query("template");

    // const parent_ctor = Object.getPrototypeOf(result);
    result.prototype.Connect = async function(parent)
    {
      await superclass.prototype.Connect.call(this, parent);
      console.log("Connecting custom class", name);

      if (template)
      {
        const clone = template.Clone(true, true);
        console.log("Found template", clone.GetNode());
        this.AppendChild(clone);
      }
    }

    result.Register({}); // Register with an empty map, which child attributes will populate

    this.SetResult(result);
    super.Connect(parent, result);
  }

  // Connect(parent)
  // {
  //   console.log("Connecting Class");
  //
  //   // const selector = this.GetAttribute("extends");
  //   // this.Select(selector);
  // }

  // Visit(visitor)
  // {
  //   console.log("Visiting Class!!!", visitor);
  //   super.Visit(visitor);
  // }

  // Name(v){ return this.SetAttribute("name", v); }
  Extends(v){ return this.SetAttribute("extends", v); }
}

Class.Register({
  id: "ID",
  extends: "Extends",
});
