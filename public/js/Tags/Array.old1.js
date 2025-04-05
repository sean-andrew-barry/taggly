import {Tag} from "/js/Tag.js";

export class Array extends Tag
{
  SetNode(){ return super.SetNode(this.constructor.CreateFragment()); }

  constructor(array = [])
  {
    super();
    this.array = array;

    // console.log("Constructing Array with", array);

    if (array)
    {
      this.Add.apply(this, array);

      // for (let i = 0; i < array.length; i++)
      // {
      //   const tag = this.Convert(array[i]);
      //   if (tag) this.AppendChild(tag);
      // }
    }
  }

  // Construct(type, args)
  // {
  //   const result = super.Construct(type, args);
  //   this.array.push(result);
  //
  //   return result;
  // }

  Apply(action, args)
  {
    const result = super.Apply(action, args);
    this.array.push(result);

    return this;
  }

  ToActions()
  {
    const array = [];

    const node = this.GetNode();
    if (node.children.length > 0)
    {
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = this.Convert(node.children[i]);
        if (tag) array.push.apply(array, tag.ToActions());
      }
    }

    return [
      "array",
      array,
    ];
  }

  toJSON()
  {
    const json = [];

    const node = this.GetNode();
    if (node.children.length > 0)
    {
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = this.Convert(node.children[i]);
        if (tag) json.push.apply(json, tag.toJSON());
      }
    }

    // console.log("~~Converted ARRAY tag to JSON", json);
    // return json;
    return [
      this.constructor.GetNodeName(),
      json,
    ];
  }

  Deconvert(){ return this.array; }
}
