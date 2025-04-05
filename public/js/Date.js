export class Date extends globalThis.Date
{
  static Encode(buffer, value)
  {
    buffer.WriteF64(value.getTime());
  }

  static Decode(buffer)
  {
    return new global.Date(buffer.ReadF64());
  }
}
