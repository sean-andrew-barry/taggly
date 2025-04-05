import "/flag#static";

/*
  This code was created with the help of this Stack Overflow question:
  https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript

  Question by Freesnöw (https://stackoverflow.com/users/595437/freesn%c3%b6w):
  https://stackoverflow.com/q/7616461

  Answer by bryc (https://stackoverflow.com/users/815680/bryc):
  https://stackoverflow.com/a/52171480

  Thank you!
*/

export class Cyrb
{
  static Internal(data, seed = 0, stride = 1)
  {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
  
    if (ArrayBuffer.isView(data))
    {
      let buffer;
      if (data instanceof Uint8Array)
      {
        buffer = data;
      }
      else
      {
        buffer = new Uint8Array(data);
      }
  
      for (let i = 0; i < buffer.length; i += stride)
      {
        const ch = buffer[i];
  
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
    }
    else
    {
      for (let i = 0; i < data.length; i += stride)
      {
        const ch = data.charCodeAt(i);
  
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
    }
  
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return {h1, h2};
  }

  static Hash32(string, seed, stride)
  {
    const {h1, h2} = this.Internal(string, seed, stride);
    return h2 >>> 0;
  }
  
  static Hash53(string, seed, stride)
  {
    const {h1, h2} = this.Internal(string, seed, stride);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  static Hash53GPT(str, seed = 0)
  {
    let h1 = seed >>> 0;
    let h2 = 0x12345678;
    let len = str.length;
  
    for (let i = 0; i < len; i++)
    {
      let c = str.charCodeAt(i);
      h1 = ((h1 << 5) + h1) ^ c;
      h2 = ((h2 << 5) + h2) + c * 33;
    }
  
    return (h1 >>> 0) + (h2 >>> 0) * 0x100000000;
  }
}

export function HashCyrb32(string, seed, stride)
{
  throw new Error(`Depreciated`);
}

export function HashCyrb53(string, seed, stride)
{
  throw new Error(`Depreciated`);
}