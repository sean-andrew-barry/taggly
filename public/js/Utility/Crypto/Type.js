export class Type
{
  static Encode(buffer, value)
  {
  }

  static Decode(buffer)
  {
    const byte = buffer.ReadU8();

    const _class = (byte & 0b1100_0000) / 64;
    const structured = (byte & 0b0010_0000) === 0b0010_0000;
  }

  constructor(type, value)
  {
    this.type = type;
    this.value = value;
  }
}

export class CountryName extends Type
{
  static GetType(){ return "2.5.4.6"; }

  constructor(value)
  {
    super("2.5.4.6", value);
  }
}

export class CommonName extends Type
{
  static GetType(){ return "2.5.4.3"; }

  constructor(value)
  {
    super("2.5.4.3", value);
  }
}
