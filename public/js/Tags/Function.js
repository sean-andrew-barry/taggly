import {Tag} from "/js/Tag.js";
import {Error} from "/js/Tags/Error.js";
import {Environment} from "/js/Environment.js";
import {Function as FunctionUtilities} from "/js/Function.js";

import {Render} from "/js/Event/Render.js";

export class Function extends Tag
{
  static GetLocalName(){ return "function"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(value)
  {
    super();

    if (typeof(value) === "function")
    {
      this.Value(value);

      if (value.hasOwnProperty("name") && value.name.length > 0)
      {
        this.Name(value.name);
      }
    }
  }

  GetDisplayString(value)
  {
    if (!value) return;

    const name = value.name;

    if (name) return `function ${name}(){...}`;
    else return `function{...}`;
  }

  Value(value)
  {
    return super.Value(value, this.GetDisplayString(value));
  }

  Load(v){ return this.SetAttribute("load", v); }
  Client(){ return this.Load("client"); } // Only run on the client
  Server(){ return this.Load("server"); } // Only run on the server
  Inline(){ return this.Load("inline"); } // Only run in an iframe

  IsAsync(){ return FunctionUtilities.IsAsync(this.GetValue()); }
  IsGenerator(){ return FunctionUtilities.IsGenerator(this.GetValue()); }
  IsAsyncGenerator(){ return FunctionUtilities.IsAsyncGenerator(this.GetValue()); }

  // GetValue()
  // {
  //   const value = super.GetValue();
  //
  //   if (typeof(value) !== "function")
  //   {
  //     throw new Error(`The Function tag expected to have a function value, but got "${typeof(value)}"`);
  //   }
  //
  //   return value;
  // }

  // Invoke the function
  Call(...args)
  {
    const value = this.GetValue();

    if (typeof(value) !== "function")
    {
      throw new Error(`The Function tag expected to have a function value, but got "${typeof(value)}"`);
    }

    args.unshift(this);

    // Invoke the function with this tag as its argument and add the results to the fragment
    return value.apply(this, args);
  }

  async Invoke(...args)
  {
    try
    {
      // Invoke the function with this tag as its argument and add the results to the fragment
      const result = await this.Call.apply(this, args);

      if (result !== undefined && result !== this)
      {
        console.warn("Return values from Function are depreciated and no longer automatically added");
        // this.Add(result);
      }
    }
    catch (error)
    {
      if (error instanceof Error)
      {
        this.Add(error);
      }
      else
      {
        // Construct an Error tag to be added as a child
        this.Add(
          new Error(error),
        );
      }
    }
  }

  async Invoke(...args)
  {
    try
    {
      // Invoke the function with this tag as its argument and add the results to the fragment
      const result = await this.Call.apply(this, args);

      if (result !== undefined && result !== this && !this.HasChildNodes())
      {
        this.Add(result);
      }
    }
    catch (error)
    {
      if (error instanceof Error)
      {
        this.Add(error);
      }
      else
      {
        // Construct an Error tag to be added as a child
        this.Add(
          new Error(error),
        );
      }
    }
  }

  Reset()
  {
    const value = this.GetValue();
    const fn = new this.constructor(value);
    this.ReplaceWith(fn);
    return fn;
  }

  async [Render](event)
  {
    if (this.IsDisabled()) return; // Don't auto invoke a disabled Function

    if (this.HasAttribute("load"))
    {
      const load = this.GetAttribute("load");
      if (load === "client" && !Environment.IsClient()) return;
      if (load === "server" && !Environment.IsServer()) return;
      if (load === "inline" && !Environment.IsInlineFrame()) return;
    }

    await this.Invoke();
  }
}
