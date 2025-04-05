export class Object extends globalThis.Object
{
  static Encode(buffer, object)
  {
    const keys = Object.keys(object);

    buffer.WriteU32(keys.length);

    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = object[key];

      buffer.Write(key);
      buffer.Write(val);
    }
  }

  static Decode(buffer)
  {
    const object = {};

    const length = buffer.ReadU32();

    for (let i = 0; i < length; i++)
    {
      const key = buffer.Read();
      const val = buffer.Read();

      object[key] = val;
    }

    return object;
  }

  static Write(object, ...keys)
  {
    const value = keys.pop();
    const key = keys.pop();

    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      object = (object[key] ??= {});
    }

    object[key] = value;

    return this;
  }

  static Read(object, ...keys)
  {
    const key = keys.pop();

    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      object = (object[key] ??= {});
    }

    return object[key];
  }

  static *EachPrototype(ctor)
  {
    let proto = Object.getPrototypeOf(ctor);
    while (proto && proto !== Base)
    {
      yield proto;
      proto = Object.getPrototypeOf(proto);
    }
  }
}
