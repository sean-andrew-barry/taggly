import {Reference} from "/js/Reference.js";
const GlobalArray = globalThis.Array;

export class Array extends GlobalArray
{
  static Encode(buffer, array)
  {
    buffer.WriteU32(array.length);
    for (let i = 0; i < array.length; i++)
    {
      buffer.Write(array[i]);
    }
  }

  static Decode(buffer)
  {
    const array = [];
    
    const length = buffer.ReadU32();
    for (let i = 0; i < length; i++)
    {
      array.push(buffer.Read());
    }
    
    return array;
  }

  // static Length(block){ return block.getUint32(); }
  static Length(block)
  {
    let bytes = 4; // 4 for the uint32
    
    const length = buffer.ReadU32();
    for (let i = 0; i < length; i++)
    {
      bytes += Reference.Length(block);
    }

    return bytes;
  }

  static Encode(block, array)
  {
    block.WriteU32(array.length);
    for (let i = 0; i < array.length; i++)
    {
      const value = array[i];
      Reference.Encode(block, value);
    }
  }

  static Decode(buffer)
  {
    const array = [];
    
    const length = buffer.ReadU32();
    for (let i = 0; i < length; i++)
    {
      const value = Reference.Decode(block);
      array.push(value);
    }
    
    return array;
  }

  static IsTemplateObject(array)
  {
    // Use the official function if it's implemented
    if (typeof(GlobalArray.isTemplateObject) === "function")
    {
      return GlobalArray.isTemplateObject(array);
    }

    // All these checks are probably not really necessary
    // This isn't a security feature or anything, it's just a convenience helper
    // TODO: Test the performance. Do these checks cause a problem?
    if (typeof(array) === "object" && array !== null && typeof(array.raw) === "object")
    {
      if (Array.isArray(array) && Array.isArray(array.raw))
      {
        if (Object.isFrozen(array) && Object.isFrozen(array.raw))
        {
          return true;
        }
      }
    }

    return false;
  }
}
