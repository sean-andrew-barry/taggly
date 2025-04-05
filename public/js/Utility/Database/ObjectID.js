import {Uint8Array} from "/js/TypedArray.js";

const MACHINE_ID = global.parseInt(Math.random() * 0xffffff, 10);
let index = ~~(Math.random() * 0xffffff);

export class ObjectID
{
  static Encode(buffer, object_id)
  {
    Uint8Array.Encode(buffer, object_id.id);
  }

  static Decode(buffer)
  {
    const value = Uint8Array.Decode(buffer);
    return new this(value);
  }

  static GetInc()
  {
    index = (index + 1) % 0xffffff;
    return index;
  }

  constructor(id)
  {
    if (id instanceof this.constructor) return id;

    this._bsontype = "ObjectID";

    if (typeof(id) === "string")
    {
      const string = id;

      if (string.length === 24)
      {
        id = new global.Uint8Array(Math.ceil(string.length / 2));

        for (let i = 0; i < id.length; i++)
        {
          id[i] = global.parseInt(string.substr(i * 2, 2), 16);
        }
      }
      else if (string.length === 12)
      {
        id = new global.Uint8Array(12);

        for (let i = 0; i < id.length; i++)
        {
          id[i] = global.parseInt(string[i]);
        }
      }
      else
      {
        throw new Error(`ObjectID string must be either 12 or 24 characters long, but got "${string}"`);
      }
    }
    else
    {
      let time = id;
      if (typeof(id) !== "number")
      {
        time = ~~(Date.now() / 1000);
      }

      // Use pid
      let pid;
      if (typeof(global.process) === "undefined" || global.process.pid === 1)
      {
        pid = Math.floor(Math.random() * 100000) % 0xffff;
      }
      else
      {
        pid = global.process.pid % 0xffff;
      }

      const inc = this.constructor.GetInc();

      const buffer = new global.Uint8Array(12);

      // Encode time
      buffer[3] = time & 0xff;
      buffer[2] = (time >> 8) & 0xff;
      buffer[1] = (time >> 16) & 0xff;
      buffer[0] = (time >> 24) & 0xff;

      // Encode machine
      buffer[6] = MACHINE_ID & 0xff;
      buffer[5] = (MACHINE_ID >> 8) & 0xff;
      buffer[4] = (MACHINE_ID >> 16) & 0xff;

      // Encode pid
      buffer[8] = pid & 0xff;
      buffer[7] = (pid >> 8) & 0xff;

      // Encode index
      buffer[11] = inc & 0xff;
      buffer[10] = (inc >> 8) & 0xff;
      buffer[9] = (inc >> 16) & 0xff;

      id = buffer;
    }

    this.id = id;

    // if (id == null || typeof(id) === "number")
    // {
    //   // Generate a new id
    //   this.id = this.generate(id);
    //   // If we are caching the hex string
    //   if (ObjectID.cacheHexString) this.__id = this.toString("hex");
    //
    //   // Return the object
    //   return;
    // }

    // if (str.length !== 24)
    // {
    //   throw new Error(`Invalid ObjectID string "${str}"`);
    // }
    // this.str = str;
  }

  HexToBuffer(string)
  {
    // Credit to csander at https://stackoverflow.com/a/38987857 for this!
    // Thank you!

    const buffer = new Uint8Array(Math.ceil(string.length / 2));
    for (var i = 0; i < buffer.length; i++)
    {
      buffer[i] = parseInt(string.substr(i * 2, 2), 16);
    }

    return buffer;
  }

  BufferToHex(buffer)
  {
    // Credit to csander at https://stackoverflow.com/a/38987857 for this!
    // Thank you!

    let string = "";
    for (let i = 0; i < buffer.length; i++)
    {
      if (buffer[i] < 16) string += "0";
      string += buffer[i].toString(16);
    }

    return string;
  }

  toString(){ return this.str; }
  valueOf(){ return this.str; }
  toJSON(){ return this.toHexString(); }

  get str(){ return this.toHexString(); }

  getTimestamp()
  {
    if (typeof(id) === "string")
    {
      id = this.HexToBuffer(id);
    }

    const timestamp = new Date();
    const time = id[3] | (id[2] << 8) | (id[1] << 16) | (id[0] << 24);
    timestamp.setTime(Math.floor(time) * 1000);
    return timestamp;
  }

  toHexString()
  {
    if (ObjectID.cacheHexString && this.__id) return this.__id;

    var hexString = '';
    if (!this.id || !this.id.length)
    {
      throw new Error(
        'invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [' +
          JSON.stringify(this.id) +
          ']'
      );
    }

    if (this.id instanceof _Buffer)
    {
      hexString = convertToHex(this.id);
      if (ObjectID.cacheHexString) this.__id = hexString;
      return hexString;
    }

    for (var i = 0; i < this.id.length; i++)
    {
      hexString += hexTable[this.id.charCodeAt(i)];
    }

    if (ObjectID.cacheHexString) this.__id = hexString;
    return hexString;
  };

  toHexString()
  {
    return this.id.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  }

  toString(format)
  {
    // Is the id a buffer then use the buffer toString method to return the format
    if (this.id && this.id.copy)
    {
      return this.id.toString(typeof(format) === "string" ? format : "hex");
    }

    // if(this.buffer )
    return this.toHexString();
  };
}
