export class Crypto
{
  static DecodePEM(string)
  {
    // string = string.replace("-----BEGIN RSA PRIVATE KEY-----", "");
    // string = string.replace("-----END RSA PRIVATE KEY-----", "");
    // string = string.replace("-----BEGIN CERTIFICATE-----", "");
    // string = string.replace("-----END CERTIFICATE-----", "");
    string = string.replaceAll("\r\n", "");
    string = string.replaceAll(/[-]+[\w\s]+[-]+/g, "");
    // string = string.replaceAll(/[-]+[\w\s]+[-]+/g, "");

    string = globalThis.atob(string);

    // TODO: Use TextEncoder
    const buffer = new Uint8Array(string.length);
    for (let i = 0; i < string.length; i++)
    {
      buffer[i] = string.charCodeAt(i);
    }

    return this.berToJavaScript(buffer);
  }

  static getClass(byteArray, position)
  {
      var cls = (byteArray[position] & 0xc0) / 64;
      // Consumes no bytes
      return cls;
  }

  static getStructured(byteArray, position)
  {
      var structured = ((byteArray[0] & 0x20) === 0x20);
      // Consumes no bytes
      return structured;
  }

  static getTag(byteArray, position)
  {
      var tag = byteArray[0] & 0x1f;
      position += 1;
      if (tag === 0x1f) {
          tag = 0;
          while (byteArray[position] >= 0x80) {
              tag = tag * 128 + byteArray[position] - 0x80;
              position += 1;
          }
          tag = tag * 128 + byteArray[position] - 0x80;
          position += 1;
      }
      return tag;
  }

  static getLength(byteArray, position)
  {
      var length = 0;

      if (byteArray[position] < 0x80) {
          length = byteArray[position];
          position += 1;
      } else {
          var numberOfDigits = byteArray[position] & 0x7f;
          position += 1;
          length = 0;
          for (var i=0; i<numberOfDigits; i++) {
              length = length * 256 + byteArray[position];
              position += 1;
          }
      }
      return length;
  }

  static GetLength(buffer)
  {
    let length = 0;

    const byte = buffer.ReadU8();
    if (byte < 0x80)
    {
      return byte;
    }
    else
    {
      const numberOfDigits = byte & 0x7f;
      position += 1;
      length = 0;

      for (var i=0; i<numberOfDigits; i++) {
        length = length * 256 + byteArray[position];
        position += 1;
      }
    }

    return length;
  }

  static berToJavaScript(byteArray)
  {
    var result = {};
    var position = 0;

    result.cls              = this.getClass(byteArray, position);
    result.structured       = this.getStructured(byteArray, position);
    result.tag              = this.getTag(byteArray, position);
    var length              = this.getLength(byteArray, position); // As encoded, which may be special value 0

    if (length === 0x80)
    {
        length = 0;
        while (byteArray[position + length] !== 0 || byteArray[position + length + 1] !== 0) {
            length += 1;
        }
        result.byteLength   = position + length + 2;
        result.contents     = byteArray.subarray(position, position + length);
    }
    else
    {
      result.byteLength   = position + length;
      result.contents     = byteArray.subarray(position, result.byteLength);
    }

    result.raw              = byteArray.subarray(0, result.byteLength); // May not be the whole input array
    return result;

    // Define the "get" functions here
  }

  // https://blog.engelke.com/2014/10/17/parsing-ber-and-der-encoded-asn-1-objects/
  static Parse(buffer)
  {
    const first = buffer.ReadU8();

    const type = byte >> 6; // Extract first 2 bits, which are the type code
    const structured = !!(first & 0b0010_0000); // True if the 3rd bit is set, otherwise false

    let tag = 0;
    if (byte & 0b0001_1111 === 0b0001_1111) // If the last 5 bits are set, the tag will be in the next bytes
    {
      while (!buffer.IsAtEnd())
      {
        let byte = buffer.ReadU8();

        if (!Buffer.GetBit(byte, 7)) break; // If it begins with a 0, we're done

        tag <<= 8; // Slide the bits over
        tag |= Buffer.ClearBit(byte, 7); // Get rid of the first bit, then add it to the tag
      }
    }
    else
    {
      tag = byte & 0b0001_1111;
    }

    let length = 0;
    const length_byte = buffer.ReadU8();
    if (length_byte < 0x80)
    {
      length = byte;
      index += 1;
    }
    else
    {
      const end = length_byte & 0x7f;

      while (!buffer.IsAtEnd())
      {
        const byte = buffer.ReadU8();

        if (!Buffer.GetBit(byte, 7)) break; // If it begins with a 0, we're done

        tag <<= 8; // Slide the bits over
        tag |= Buffer.ClearBit(byte, 7); // Get rid of the first bit, then add it to the tag
      }

      index += 1;
      for (let i = 0; i < end; i++)
      {
        length = length * 256 + bytes[index];
        index += 1;
      }
    }
  }

  static Parse(bytes, index = 0)
  {
    let byte = bytes[index];
    // const byte = 0x04;

    const type = (byte & 0b1100_0000) >> 6; // Extract first 2 bits
    const structured = !!(byte & 0b0010_0000); // True if the 3rd bit is set, otherwise false

    let tag;
    if (byte & 0b0001_1111 === 0b0001_1111)
    {
      console.log("All 1");

      index += 1;
      for (; index < bytes.length; index++)
      {
        let byte = bytes[index];

        // If the byte begins with a 1
        if (byte & 0b1000_0000 === 0b1000_0000)
        {
          tag <<= 8;
          tag |= (byte | 0b1000_0000); // Get rid of the first bit
        }
        else
        {
          break;
        }
      }

      tag = true;
    }
    else
    {
      tag = byte & 0b0001_1111;
      index += 1;
    }

    let length = 0;
    byte = bytes[index];
    if (byte < 0x80)
    {
      length = byte;
      index += 1;
    }
    else
    {
      const numberOfDigits = bytes[index] & 0x7f;
      index += 1;
      for (let i = 0; i < numberOfDigits; i++)
      {
        length = length * 256 + bytes[index];
        index += 1;
      }
    }

    let content = [];
    if (length === 0) // Unknown length, go until 2 zero bytes in a row
    {
      while ((index + length) < bytes.length)
      {
        const byte = bytes[index + length];
        const next = bytes[index + length + 1];

        if (byte === 0 && next === 0)
        {
          break;
        }
        else
        {
          length += 1;
        }
      }

      content = bytes.subarray(index, index + length);
    }
    else
    {
      content = bytes.subarray(index, index + length);
    }

    return {
      type,
      structured,
      tag,
      length,
      content,
    };
  }
}
