import {Tag} from "/js/Tag.js";
import {Connect} from "/js/Event/Connect.js";

export class Array extends Tag
{
  // static SetNodeName(name = "array"){ return super.SetNodeName(name); }
  static GetLocalName(){ return "array"; }
  static GetMetaURL(){ return import.meta.url; }

  // SetNode(){ return super.SetNode(this.constructor.CreateFragment()); }

  // constructor(array = [])
  // {
  //   super();
  //
  //   if (array instanceof window.Node)
  //   {
  //     this.SetNode(array);
  //     array = Tag.GetNodeValue(array);
  //   }
  //
  //   if (!(array instanceof global.Array))
  //   {
  //     throw new Error(`The Array Tag expected a standard Array object`);
  //   }
  //
  //   this.array = array;
  //
  //   // console.log("Constructing Array with", array);
  //
  //   if (array)
  //   {
  //     this.Add.apply(this, array);
  //
  //     // for (let i = 0; i < array.length; i++)
  //     // {
  //     //   const tag = this.Convert(array[i]);
  //     //   if (tag) this.AppendChild(tag);
  //     // }
  //   }
  // }

  constructor(value)
  {
    super();
    if (value instanceof global.Array)
    {
      this.Value(value);
    }
  }

  [Connect](event)
  {
    if (this.IsDisabled()) return; // If disabled, don't auto invoke

    const value = this.GetValue();

    if (typeof(value) !== "object")
    {
      throw new Error(`The Array tag expected to have an object value, but got "${typeof(value)}"`);
    }

    if (!(value instanceof global.Array))
    {
      throw new Error(`The Array tag expected its value to be an array`);
    }

    // Apply item in the value array
    this.Add.apply(this, value);
  }

  // SetNode(node)
  // {
  //   const result = super.SetNode(node);
  //   this.array ??= Tag.GetNodeValue(node);
  //
  //   if (this.array)
  //   {
  //     this.Add.apply(this, this.array);
  //   }
  //
  //   return result;
  // }

  // Apply(action, args)
  // {
  //   const result = super.Apply(action, args);
  //   this.array.push(result);
  //
  //   return this;
  // }

  // ToActions()
  // {
  //   const array = [];
  //
  //   const node = this.GetNode();
  //   if (node.children.length > 0)
  //   {
  //     for (let i = 0; i < node.children.length; i++)
  //     {
  //       const tag = this.Convert(node.children[i]);
  //       if (tag) array.push.apply(array, tag.ToActions());
  //     }
  //   }
  //
  //   return [
  //     "array",
  //     array,
  //   ];
  // }

  toJSON()
  {
    const json = [];

    const node = this.GetNode();
    if (node.children.length > 0)
    {
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = node.children[i].tag;
        if (tag) json.push.apply(json, tag.toJSON());
      }
    }

    return [
      this.constructor.GetNodeName(),
      json,
    ];
  }

  Deconvert(){ return this.GetValue(); }
}
