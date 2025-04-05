const INDEX = Symbol("index");
// const VALUE = Symbol("value");

// A pointer stores the index of where a Block is located
export class Pointer
{
  static Length(block) {
    return block.SkipU32();
  }

  static Encode(block, pointer) {
    block.WriteU32(pointer.GetIndex());
  }

  static Decode(block) {
    const index = block.ReadU32();
    return new this(index);
  }

  constructor(index) {
    this[INDEX] = index;
  }

  GetIndex() { return this[INDEX]; }

  GetBlock(block) {
    return block.constructor.At(this.GetIndex());
  }
}