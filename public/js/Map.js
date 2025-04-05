export class Map extends globalThis.Map
{
  static Encode(buffer, map)
  {
    buffer.WriteU32(map.size);

    for (const [key, value] of map)
    {
      buffer.Write(key);
      buffer.Write(value);
    }
  }

  static Decode(buffer)
  {
    const map = new globalThis.Map();

    const size = buffer.ReadU32();
    for (let i = 0; i < size; i++)
    {
      const key = buffer.Read();
      const val = buffer.Read();

      map.set(key, val);
    }

    return map;
  }
}
