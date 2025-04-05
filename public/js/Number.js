export class Number extends globalThis.Number
{
  static NextPowerOf2(value)
  {
    let power = 1;
    while (power < value)
    {
      power *= 2;
    }

    return power;
  }

  static Random(max)
  {
    return Math.floor(Math.random() * max);
  }

  static RandomIndex(array, length = array.length ?? array.size)
  {
    return array[this.Random(length)];
  }

  static Encode(buffer, value){ return buffer.WriteF64(value); }
  static Decode(buffer){ return buffer.ReadF64(); }
}
