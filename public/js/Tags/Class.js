import {Tag} from "/js/Tag.js";
import {Connect} from "/js/Event/Connect.js";
import {Error} from "/js/Tags/Error.js";
import {Environment} from "/js/Environment.js";

export class Class extends Tag
{
  static GetLocalName(){ return "class"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(value)
  {
    super();

    if (typeof(value) === "function")
    {
      this.Value(value);

      if (value.hasOwnProperty("name"))
      {
        this.Name(value.name);
      }
    }
  }

  GetDisplayString(value)
  {
    if (!value) return;

    const name = value.name;
    const parent = Object.getPrototypeOf(value)?.name;

    if (name && parent) return `class ${name} extends ${parent}{...}`;
    else if (parent) return `class extends ${parent}{...}`;
    else if (name) return `class ${name}{...}`;
    else return `class{...}`;
  }

  Value(value)
  {
    return super.Value(value, this.GetDisplayString(value));
  }

  Load(v){ return this.SetAttribute("load", v); }
  Client(){ return this.Load("client"); } // Only run on the client
  Server(){ return this.Load("server"); } // Only run on the server
  Inline(){ return this.Load("inline"); } // Only run in an iframe

  // Invoke the function
  Call(...args)
  {
    const value = this.GetValue();

    if (typeof(value) !== "function")
    {
      throw new Error(`The Class tag expected to have a function value, but got "${typeof(value)}"`);
    }

    args.unshift(this);

    // Invoke the function with this tag as its argument and add the results to the fragment
    return new value(...args);
  }

  async [Connect](event)
  {
    if (this.IsDisabled()) return; // Don't auto invoke a disabled Function

    if (this.HasAttribute("load"))
    {
      const load = this.GetAttribute("load");
      if (load === "client" && !Environment.IsClient()) return;
      if (load === "server" && !Environment.IsServer()) return;
      if (load === "inline" && !Environment.IsInlineFrame()) return;
    }

    try
    {
      // Invoke the function with this tag as its argument and add the results to the fragment
      const result = await this.Call();

      if (result !== undefined && result !== this)
      {
        this.Add(result);
      }
    }
    catch (error)
    {
      // Construct an Error tag to be added as a child
      this.Add(
        new Error(error),
      );
    }
  }
}
