import {Position} from "/js/Parser/Position.js";

const PARENT = Symbol("parent");
const CHILDREN = Symbol("children");
const VALUE = Symbol("value");

export class Token extends Position
{
  SetParent(parent){ this[PARENT] = parent; }
  GetParent(){ return this[PARENT]; }

  SetChildren(children){ this[CHILDREN] = children; }
  GetChildren(){ return this[CHILDREN] ??= []; }

  SetValue(value){ this[VALUE] = value; }
  GetValue(){ return this[VALUE]; }

  // Can be another token or a string
  Add(value)
  {
    const children = this.GetChildren();

    this.AddLength(value.length);
    children.push(value);

    if (typeof(value) !== "string")
    {
      value.SetParent(this);
    }
  }

  Parse(p)
  {
  }

  *[Symbol.iterator]()
  {
    const children = this.GetChildren();

    for (let i = 0; i < children.length; i++)
    {
      const child = children[i];

      if (child instanceof Token)
      {
        yield* child;
      }
    }
  }
}
