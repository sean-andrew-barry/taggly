import {Tag} from "/js/Tag.js";
import {CSS} from "/js/Tags/CSS.js";
import {Text} from "/js/Tags/Text.js";
import {Style} from "/js/Tags/Style.js";
import {Environment} from "/js/Environment.js";
import {Connect} from "/js/Event/Connect.js";
import {Disconnect} from "/js/Event/Disconnect.js";
import {Render} from "/js/Event/Render.js";

let count = 0;

export class Scope extends CSS
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "scope"; }

  Selector(...selectors)
  {
    const id = `${this.constructor.GetHash()}${count++}`;
    this.ID(id);

    if (selectors.length > 0)
    {
      for (let i = 0; i < selectors.length; i++)
      {
        const selector = selectors[i];

        // If it's a tag instance or a tag class, get its local name
        if (typeof(selector) === "object" && selector instanceof Tag)
        {
          selectors[i] = selector.GetLocalName();
        }
        else if (typeof(selector) === "function")
        {
          const ctor = selector[Symbol.species];
          if (ctor)
          {
            selectors[i] = ctor.GetLocalName();
          }
        }

        selectors[i] = `#${id} ${selectors[i]}`;
      }
    }
    else
    {
      selectors.push(`#${id} *`);
    }

    return this.SetAttribute("selector", selectors);
  }

  _CreateSelector()
  {
    const id = `${this.constructor.GetHash()}${count++}`;
    this.ID(id);

    return `#${id} ${super.CreateSelector()}`.trim();
  }

  _CreateSelector()
  {
    const id = `${this.constructor.GetHash()}${count++}`;
    this.ID(id);

    return super.CreateSelector(`#${id}`);
  }

  // CreateSelector()
  // {
  //   const id = `${this.constructor.GetHash()}${count++}`;
  //   this.ID(id);
  //
  //   return `#${id} *`;
  // }

  // [Connect](event)
  // {
  // }
  //
  // [Disconnect](event)
  // {
  // }

  // [Render](event)
  // {
  //   console.log("Scope rendering", this.GetStyleText());
  // }
}
