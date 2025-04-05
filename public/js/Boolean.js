export class Boolean extends globalThis.Boolean
{
  static Encode(buffer, value)
  {
    if (value === true)
    {
      return buffer.WriteU8(1);
    }
    else
    {
      return buffer.WriteU8(0);
    }
  }

  static Decode(buffer)
  {
    const boolean = buffer.ReadU8();

    if      (boolean === 1) return true;
    else if (boolean === 0) return false;
    else throw new Error(`Unknown buffer value of "${boolean}"`);
  }
}