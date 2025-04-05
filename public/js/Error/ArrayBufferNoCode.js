import {Error} from "/js/Error.js";

export class ArrayBufferNoCode extends Error
{
  get message()
  {
    return `ArrayBuffer cannot write value "${this.value}", because there is no code for type "${this.type?.name ?? this.type}"`;
  }

  get help()
  {
    return `This error usually happens because the encoding and decoding of some object are not precisely mirrored. For example, if the Encode advanced an extra 4 bytes, but the Decode does not match that.`;
  }
}
