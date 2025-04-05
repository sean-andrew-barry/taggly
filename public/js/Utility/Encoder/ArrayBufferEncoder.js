import {Encoder} from "/js/Utility/Encoder.js";

export class ArrayBufferEncoder extends Encoder
{
  Encode(buffer, value)
  {
    // this.Allocate(this.offset + (value.byteLength * 8));

    const start = this.WriteU32(0);

    const array = new Uint8Array(value);
    // this.Allocate(array.length * 2);

    // const start = this.GetOffset();
    // this.WriteU16(array.length);
    for (let i = 0; i < array.length; i++)
    {
      this.WriteU8(value[i]);
    }

    // const size = this.GetOffset() - start - 4;
    const end = this.GetOffset();

    // Now that we know the size, overwrite that 0 with the real size
    this.WriteU32(end, start, false);

    console.log("Writing ArrayBuffer", start, end, value.byteLength);
  }

  Decode(buffer)
  {
    const end = this.ReadU32();
    const offset = this.GetOffset();
    console.log("Reading ArrayBuffer", offset, end);
    this.Move(end);
    const result = this.buffer.slice(offset, end);
    console.log(result);
    return result;
    // console.log("ArrayBuffer result", result);
    // return global.Buffer.from(this.buffer, offset, end - offset);
    // return new Uint8Array(result);
  }

  GetType(){ return ArrayBuffer; }
}
