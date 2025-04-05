import {Tag} from "/js/Tag.js";
import {Class} from "/js/Tags/Elember/Class.js";

export class Attribute extends Tag
{
  Connect(parent)
  {
    if (!this.HasAttribute("skip"))
    {
      const target = this.GetTarget();

      this.Expect(target).Named("target").ToBeInstanceOf(Class);

      const result = target.GetResult();

      const name = this.GetAttribute("name");
      const call = this.GetAttribute("call");
      const type = this.GetAttribute("type");
      const min = Number(this.GetAttribute("min"));
      const max = Number(this.GetAttribute("max"));

      const map = result.GetMap();
      map[name] = call;
      console.log("Mapped attribute", name, call);

      result.prototype[call] = function(value)
      {
        console.log("Setting attribute", name, "from", call, "with", value);

        const expect = this.Expect(value).Named("value");

        switch (type)
        {
          case "string":
          {
            if (type) expect.ToBeString(type);
            if (typeof(min) === "number") expect.ToBeLongerThan(min);
            if (typeof(max) === "number") expect.ToBeShorterThan(max);
            break;
          }
          default:
          {
            throw new Error(`Unknown attribute type of "${type}"`);
          }
        }

        return this.SetAttribute(name, value);
      }
    }

    super.Connect(parent);
  }

  Name(v){ return this.SetAttribute("name", v); }
  Call(v){ return this.SetAttribute("call", v); }
  Type(v){ return this.SetAttribute("type", v); }
  Min(v){ return this.SetAttribute("min", v); }
  Max(v){ return this.SetAttribute("max", v); }
  Skip(v){ return this.ToggleAttribute("skip", v); }
  IsString(v){ return this.ToggleAttribute("is-string", v); }
  IsSlug(v){ return this.ToggleAttribute("is-slug", v); }
  IsNumber(v){ return this.ToggleAttribute("is-number", v); }
  IsDate(v){ return this.ToggleAttribute("is-date", v); }
}

Attribute.Register({
  name: "Name",
  call: "Call",
  skip: "Skip",
  type: "Type",
  min: "Min",
  max: "Max",
});
