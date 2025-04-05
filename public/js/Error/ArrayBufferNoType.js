import {Error} from "/js/Error.js";
import {Symbol} from "/js/Symbol.js";

export class ArrayBufferNoType extends Error
{
  get message()
  {
    return `ArrayBuffer cannot write value "${this.value}", because it cannot find a constructor for it.`;
  }

  get help()
  {
    return `This error usually occurs because the ArrayBuffer was given some value that it doesn't know how to encode/decode. To fix this, your value's class must be registered with the Codes Map.`;
  }

  async [Symbol.toTag](tags)
  {
    const {Div} = await tags;

    return new Div().Class("").Add(
      
    );
  }
}
