import {Tag} from "/js/Tag.js";
// import {OnConnect} from "/js/Tags/Event/OnConnect.js";

export class Pointer extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "pointer"; }

  constructor(value)
  {
    // console.log("~~~Constructing pointer~~~");
    super();
    if (value)
    {
      this.Value(value);
    }
  }

  // [OnConnect](event)
  // {
  //   if (this.IsDisabled()) return;
  //
  //   if (this.HasAttribute("scoped"))
  //   {
  //   }
  // }

  Mode(mode){ return this.SetAttribute("mode", mode); }
  Scoped(){ return this.Mode("scoped"); }
  Closest(){ return this.Mode("closest"); }
  Global(){ return this.Mode("global"); }
  Children(){ return this.Mode("children"); }

  // Scoped is the default mode, so fall back to it if no mode is set
  GetMode(){ return this.GetAttribute("mode") || "scoped"; }

  Search(selector)
  {
    console.log("Pointer searching for", selector, "with mode", this.GetMode());
    switch (this.GetMode())
    {
      case "scoped": return this.QueryScope(selector); // Query older siblings and parents
      case "closest": return this.QueryClosest(selector); // Query parents
      case "global": return Tag.Query(selector); // Query anything in the DOM
      case "children": return this.Query(selector); // Query children of the pointer
      default: throw new Error(`Pointer tag got an unknown mode of "${this.GetMode()}"`);
    }
  }

  GetValue()
  {
    const value = super.GetValue();
    if (typeof(value) !== "string")
    {
      throw new Error(`Pointer tag expected to have a string as its value`);
    }

    const result = this.Search(value);

    // If the result is another pointer, then follow it as well
    if (result instanceof this.constructor)
    {
      return result.GetValue();
    }
    else
    {
      return result;
    }
  }
}
