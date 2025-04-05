export class Set extends globalThis.Set
{
  static Encode(buffer, set)
  {
    buffer.WriteU32(set.size);

    for (const value of set)
    {
      buffer.Write(value);
    }
  }

  static Decode(buffer)
  {
    const set = new global.Set();

    const size = buffer.ReadU32();
    for (let i = 0; i < size; i++)
    {
      const value = buffer.Read();
      set.add(value);
    }

    return set;
  }
}
