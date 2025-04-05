export class NaN
{
  static Encode(buffer, value)
  {
  }

  static Decode(buffer)
  {
    return global.Number.NaN;
  }
}
