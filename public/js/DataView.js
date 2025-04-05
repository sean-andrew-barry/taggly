import { SERVER_IS_LITTLE_ENDIAN as SVR, SYSTEM_IS_LITTLE_ENDIAN as SYS } from "/js/Constants.js";

export class DataView extends globalThis.DataView
{
  setInt8(i, v, e = SVR) { return super.setInt8(i, v, e); }
  setUint8(i, v, e = SVR) { return super.setUint8(i, v, e); }
  setInt16(i, v, e = SVR) { return super.setInt16(i, v, e); }
  setUint16(i, v, e = SVR) { return super.setUint16(i, v, e); }
  setInt32(i, v, e = SVR) { return super.setInt32(i, v, e); }
  setUint32(i, v, e = SVR) { return super.setUint32(i, v, e); }
  setFloat32(i, v, e = SVR) { return super.setFloat32(i, v, e); }
  setBigInt64(i, v, e = SVR) { return super.setBigInt64(i, v, e); }
  setBigUint64(i, v, e = SVR) { return super.setBigUint64(i, v, e); }
  setFloat64(i, v, e = SVR) { return super.setFloat64(i, v, e); }

  getInt8(i, e = SVR) { return super.getInt8(i, e); }
  getUint8(i, e = SVR) { return super.getUint8(i, e); }
  getInt16(i, e = SVR) { return super.getInt16(i, e); }
  getUint16(i, e = SVR) { return super.getUint16(i, e); }
  getInt32(i, e = SVR) { return super.getInt32(i, e); }
  getUint32(i, e = SVR) { return super.getUint32(i, e); }
  getFloat32(i, e = SVR) { return super.getFloat32(i, e); }
  getBigInt64(i, e = SVR) { return super.getBigInt64(i, e); }
  getBigUint64(i, e = SVR) { return super.getBigUint64(i, e); }
  getFloat64(i, e = SVR) { return super.getFloat64(i, e); }

  // `e` represents the DESIRED endianness, which may or may not match the the endianness of the server or client
  Copy(index, data, e = SVR)
  {
    if (!ArrayBuffer.isView(data))
    {
      throw new TypeError(`Expected parameter data to be an ArrayBuffer view, not ${data?.constructor.name}`);
    }

    // A DataView will get copied over without regard to endianness
    if (data instanceof globalThis.DataView)
    {
      data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    const bytes = data.constructor.BYTES_PER_ELEMENT;

    // If the desired endianness is the same as the system we're running on
    // or it's 1 byte, then we can just copy the data as normal
    if (e === SYS || bytes === 1)
    {
      const target = new data.constructor(this.buffer, this.byteOffset, data.length);
      target.set(data, index);
    }
    else if (bytes === 2)
    {
      if (data instanceof Int16Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setInt16(i * bytes + index, data[i], e);
        }
      }
      else if (data instanceof Uint16Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setUint16(i * bytes + index, data[i], e);
        }
      }
    }
    else if (bytes === 4)
    {
      if (data instanceof Int32Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setInt32(i * bytes + index, data[i], e);
        }
      }
      else if (data instanceof Uint32Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setUint32(i * bytes + index, data[i], e);
        }
      }
      else if (data instanceof Float32Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setFloat32(i * bytes + index, data[i], e);
        }
      }
    }
    else if (bytes === 8)
    {
      if (data instanceof BigInt64Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setBigInt64(i * bytes + index, data[i], e);
        }
      }
      else if (data instanceof BigUint64Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setBigUint64(i * bytes + index, data[i], e);
        }
      }
      else if (data instanceof Float64Array)
      {
        for (let i = 0; i < data.length; i++)
        {
          this.setFloat64(i * bytes + index, data[i], e);
        }
      }
    }

    return data.byteLength;
  }

  // `e` represents the DESIRED endianness, which may or may not match the the endianness of the server or client
  Extract(type, index, length, e = SYS)
  {
    if (typeof index !== 'number' || typeof length !== 'number')
    {
      throw new TypeError('Index and length must be numbers');
    }

    if (length <= 0)
    {
      throw new RangeError('Length must be positive');
    }

    const bytes = type.BYTES_PER_ELEMENT;
    const bufferLength = length * bytes;
    const extractedData = new type(this.buffer, this.byteOffset + index, length);
    new BigInt64Array();

    if (e === SVR || bytes === 1)
    {
      // If the desired endianness is the same as the system or it's 1 byte,
      // then we can return the data as is
      return extractedData;
    }
    else
    {
      // For multi-byte types, we need to handle endianness
      const result = new type(length);
      for (let i = 0; i < length; i++)
      {
        switch (bytes)
        {
          case 2:
            result[i] = this.getUint16(index + i * bytes, e);
            break;
          case 4:
            if (type === Float32Array)
            {
              result[i] = this.getFloat32(index + i * bytes, e);
            }
            else
            {
              result[i] = this.getUint32(index + i * bytes, e);
            }
            break;
          case 8:
            if (type === Float64Array)
            {
              result[i] = this.getFloat64(index + i * bytes, e);
            }
            else if (type === BigInt64Array)
            {
              result[i] = this.getBigInt64(index + i * bytes, e);
            }
            else
            {
              result[i] = this.getBigUint64(index + i * bytes, e);
            }
            break;
          default:
            throw new Error('Unsupported type');
        }
      }
      return result;
    }
  }
}