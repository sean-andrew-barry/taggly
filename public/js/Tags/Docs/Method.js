import {Tag} from "/js/Tag.js";
import {Property, APPEND} from "/js/Tags/Docs/Property.js";

export class Method extends Property
{
  static GetNodeName(){ return "method"; }

  Returns(text){ return this[APPEND](Tag.Return().Text(text)); }
  Parameter(text){ return this[APPEND](Tag.Parameter().Text(text)); }

  Apply(tag, name, value)
  {
    const method = this.GetFirstClass();
    const fn = tag[method];

    if (typeof(fn) === "function")
    {
      // console.log("Applying", name, value);
      fn.call(tag, value);
    }
  }
}
