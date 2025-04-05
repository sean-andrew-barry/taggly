export class BigInt extends globalThis.BigInt
{
  static Encode(buffer, value){ return buffer.WriteF64(value); }
  static Decode(buffer){ return buffer.ReadF64(); }
}
