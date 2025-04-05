import {Tag} from "/js/Tag.js";

export class Array extends Tag
{
  // static GetNodeName(){ return "array"; }
  static GetLocalName(){ return "array"; }

  constructor(array)
  {
    super();
    this.array = array;
  }

  Render()
  {
    const fragment = this.constructor.CreateFragment();

    for (let i = 0; i < this.array.length; i++)
    {
      const tag = this.Convert(this.array[i]);
      if (tag) fragment.appendChild(tag.GetNode());
    }

    const parent = this.GetParentNode();

    // Swap the array node with the fragment, which adds the tags to the DOM
    parent.replaceChild(fragment, this.GetNode());

    // return super.Render();
    return this;
  }

  Deconvert(){ return this.array; }

  Deconvert()
  {
    if (!this.array)
    {
      this.array = [];
    }

    return this.array;
  }
}

Array.Register();
