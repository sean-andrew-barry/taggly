import {Tag} from "/js/Tag.js";
import {Error} from "/js/Tags/Error.js";
import {Fragment} from "/js/Tags/Fragment.js";

export class Iterable extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "iterable"; }

  // CreateNode(node){ return super.CreateNode(node ?? this.constructor.CreateNodeFragment()); }

  constructor(value)
  {
    super();

    // console.log("Iterable with", value);

    this.value = value;
    // for (const v of value)
    // {
    //   const tag = this.Convert(v);
    //   if (tag) this.AppendChild(tag);
    // }
    this.Iterate(value);
  }

  Iterate(value)
  {
    try
    {
      for (const v of value)
      {
        // console.log("Iterated", v);
        this.AppendChild(v);
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

  // Deconvert(){ return this.value; }
}
