// NOTE: This file is currently unused, it's just here to hold code I may use later

global.Blob ??= class Blob
{
  #instance;

  get size(){ return Contextify(this.#instance.size); }
  set size(value){ return Contextify(this.#instance.size = value); }

  get type(){ return Contextify(this.#instance.type); }
  set type(value){ return Contextify(this.#instance.type = value); }

  constructor(...args)
  {
    this.#instance = new host.URL(...args);
    redirects.set(this.#instance, this);
  }

  arrayBuffer(...args){ return Contextify(this.#instance.arrayBuffer(...args)); }
  slice(...args){ return Contextify(this.#instance.slice(...args)); }
  stream(...args){ return Contextify(this.#instance.stream(...args)); }
  text(...args){ return Contextify(this.#instance.text(...args)); }
  toJSON(...args){ return Contextify(this.#instance.toJSON(...args)); }
}

global.Buffer ??= class Buffer extends Uint8Array
{
  static alloc(...args){ return Contextify(host.Buffer.alloc(...args)); }
  static allocUnsafe(...args){ return Contextify(host.Buffer.allocUnsafe(...args)); }
  static allocUnsafeSlow(...args){ return Contextify(host.Buffer.allocUnsafeSlow(...args)); }
  static byteLength(...args){ return Contextify(host.Buffer.byteLength(...args)); }
  static compare(...args){ return Contextify(host.Buffer.compare(...args)); }
  static concat(...args){ return Contextify(host.Buffer.concat(...args)); }
  static from(...args){ return Contextify(host.Buffer.from(...args)); }
  static isBuffer(...args){ return Contextify(host.Buffer.isBuffer(...args)); }
  static isEncoding(...args){ return Contextify(host.Buffer.isEncoding(...args)); }

  #instance;

  get poolSize(){ return Contextify(this.#instance.poolSize); }
  set poolSize(value){ return Contextify(this.#instance.poolSize = value); }

  get buffer(){ return Contextify(this.#instance.buffer); }
  set buffer(value){ return Contextify(this.#instance.buffer = value); }

  get byteOffset(){ return Contextify(this.#instance.byteOffset); }
  set byteOffset(value){ return Contextify(this.#instance.byteOffset = value); }

  get length(){ return Contextify(this.#instance.length); }
  set length(value){ return Contextify(this.#instance.length = value); }

  constructor(...args)
  {
    this.#instance = new host.Buffer(...args);
    redirects.set(this.#instance, this);
    // console.log("Constructing a buffer!");
  }

  compare(...args){ return Contextify(this.#instance.compare(...args)); }
  copy(...args){ return Contextify(this.#instance.copy(...args)); }
  entries(...args){ return Contextify(this.#instance.entries(...args)); }
  equals(...args){ return Contextify(this.#instance.equals(...args)); }
  fill(...args){ return Contextify(this.#instance.fill(...args)); }
  includes(...args){ return Contextify(this.#instance.includes(...args)); }
  indexOf(...args){ return Contextify(this.#instance.indexOf(...args)); }
  keys(...args){ return Contextify(this.#instance.keys(...args)); }
  lastIndexOf(...args){ return Contextify(this.#instance.lastIndexOf(...args)); }

  readBigInt64BE(...args){ return Contextify(this.#instance.readBigInt64BE(...args)); }
  readBigInt64LE(...args){ return Contextify(this.#instance.readBigInt64LE(...args)); }
  readBigUInt64BE(...args){ return Contextify(this.#instance.readBigUInt64BE(...args)); }
  readBigUInt64LE(...args){ return Contextify(this.#instance.readBigUInt64LE(...args)); }
  readDoubleBE(...args){ return Contextify(this.#instance.readDoubleBE(...args)); }
  readDoubleLE(...args){ return Contextify(this.#instance.readDoubleLE(...args)); }
  readFloatBE(...args){ return Contextify(this.#instance.readFloatBE(...args)); }
  readFloatLE(...args){ return Contextify(this.#instance.readFloatLE(...args)); }
  readInt8(...args){ return Contextify(this.#instance.readInt8(...args)); }
  readInt16BE(...args){ return Contextify(this.#instance.readInt16BE(...args)); }
  readInt16LE(...args){ return Contextify(this.#instance.readInt16LE(...args)); }
  readInt32BE(...args){ return Contextify(this.#instance.readInt32BE(...args)); }
  readInt32LE(...args){ return Contextify(this.#instance.readInt32LE(...args)); }
  readIntBE(...args){ return Contextify(this.#instance.readIntBE(...args)); }
  readIntLE(...args){ return Contextify(this.#instance.readIntLE(...args)); }
  readUInt8(...args){ return Contextify(this.#instance.readUInt8(...args)); }
  readUInt16BE(...args){ return Contextify(this.#instance.readUInt16BE(...args)); }
  readUInt16LE(...args){ return Contextify(this.#instance.readUInt16LE(...args)); }
  readUInt32BE(...args){ return Contextify(this.#instance.readUInt32BE(...args)); }
  readUInt32LE(...args){ return Contextify(this.#instance.readUInt32LE(...args)); }
  readUIntBE(...args){ return Contextify(this.#instance.readUIntBE(...args)); }
  readUIntLE(...args){ return Contextify(this.#instance.readUIntLE(...args)); }
  subarray(...args){ return Contextify(this.#instance.subarray(...args)); }
  slice(...args){ return Contextify(this.#instance.slice(...args)); }
  swap16(...args){ return Contextify(this.#instance.swap16(...args)); }
  swap32(...args){ return Contextify(this.#instance.swap32(...args)); }
  swap64(...args){ return Contextify(this.#instance.swap64(...args)); }
  toJSON(...args){ return Contextify(this.#instance.toJSON(...args)); }
  toString(...args){ return Contextify(this.#instance.toString(...args)); }
  values(...args){ return Contextify(this.#instance.values(...args)); }
  write(...args){ return Contextify(this.#instance.write(...args)); }
  writeBigInt64BE(...args){ return Contextify(this.#instance.writeBigInt64BE(...args)); }
  writeBigInt64LE(...args){ return Contextify(this.#instance.writeBigInt64LE(...args)); }
  writeBigUInt64BE(...args){ return Contextify(this.#instance.writeBigUInt64BE(...args)); }
  writeBigUInt64LE(...args){ return Contextify(this.#instance.writeBigUInt64LE(...args)); }
  writeDoubleBE(...args){ return Contextify(this.#instance.writeDoubleBE(...args)); }
  writeDoubleLE(...args){ return Contextify(this.#instance.writeDoubleLE(...args)); }
  writeFloatBE(...args){ return Contextify(this.#instance.writeFloatBE(...args)); }
  writeFloatLE(...args){ return Contextify(this.#instance.writeFloatLE(...args)); }
  writeInt8(...args){ return Contextify(this.#instance.writeInt8(...args)); }
  writeInt16BE(...args){ return Contextify(this.#instance.writeInt16BE(...args)); }
  writeInt16LE(...args){ return Contextify(this.#instance.writeInt16LE(...args)); }
  writeInt32BE(...args){ return Contextify(this.#instance.writeInt32BE(...args)); }
  writeInt32LE(...args){ return Contextify(this.#instance.writeInt32LE(...args)); }
  writeIntBE(...args){ return Contextify(this.#instance.writeIntBE(...args)); }
  writeIntLE(...args){ return Contextify(this.#instance.writeIntLE(...args)); }
  writeUInt8(...args){ return Contextify(this.#instance.writeUInt8(...args)); }
  writeUInt16BE(...args){ return Contextify(this.#instance.writeUInt16BE(...args)); }
  writeUInt16LE(...args){ return Contextify(this.#instance.writeUInt16LE(...args)); }
  writeUInt32BE(...args){ return Contextify(this.#instance.writeUInt32BE(...args)); }
  writeUInt32LE(...args){ return Contextify(this.#instance.writeUInt32LE(...args)); }
  writeUIntBE(...args){ return Contextify(this.#instance.writeUIntBE(...args)); }
  writeUIntLE(...args){ return Contextify(this.#instance.writeUIntLE(...args)); }
}

global.URL ??= class URL
{
  static createObjectURL(...args){ return Contextify(host.URL.createObjectURL(...args)); }
  static revokeObjectURL(...args){ return Contextify(host.URL.revokeObjectURL(...args)); }

  #instance;

  get hash(){ return Contextify(this.#instance.hash); }
  get host(){ return Contextify(this.#instance.host); }
  get hostname(){ return Contextify(this.#instance.hostname); }
  get href(){ return Contextify(this.#instance.href); }
  get origin(){ return Contextify(this.#instance.origin); }
  get password(){ return Contextify(this.#instance.password); }
  get pathname(){ return Contextify(this.#instance.pathname); }
  get port(){ return Contextify(this.#instance.port); }
  get protocol(){ return Contextify(this.#instance.protocol); }
  get search(){ return Contextify(this.#instance.search); }
  get searchParams(){ return Contextify(this.#instance.searchParams); }
  get username(){ return Contextify(this.#instance.username); }

  set hash(value){ return Contextify(this.#instance.hash = value); }
  set host(value){ return Contextify(this.#instance.host = value); }
  set hostname(value){ return Contextify(this.#instance.hostname = value); }
  set href(value){ return Contextify(this.#instance.href = value); }
  set origin(value){ return Contextify(this.#instance.origin = value); }
  set password(value){ return Contextify(this.#instance.password = value); }
  set pathname(value){ return Contextify(this.#instance.pathname = value); }
  set port(value){ return Contextify(this.#instance.port = value); }
  set protocol(value){ return Contextify(this.#instance.protocol = value); }
  set search(value){ return Contextify(this.#instance.search = value); }
  set searchParams(value){ return Contextify(this.#instance.searchParams = value); }
  set username(value){ return Contextify(this.#instance.username = value); }

  constructor(...args)
  {
    this.#instance = new host.URL(...args);
    redirects.set(this.#instance, this);
  }

  toString(...args){ return Contextify(this.#instance.toString(...args)); }
  toJSON(...args){ return Contextify(this.#instance.toJSON(...args)); }
}

global.URLSearchParams ??= class URLSearchParams
{
  #instance;

  constructor(...args)
  {
    this.#instance = new host.URLSearchParams(...args);
    redirects.set(this.#instance, this);
  }

  append(...args){ return Contextify(this.#instance.append(...args)); }
  delete(...args){ return Contextify(this.#instance.delete(...args)); }
  entries(...args){ return Contextify(this.#instance.entries(...args)); }
  forEach(...args){ return Contextify(this.#instance.forEach(...args)); }
  get(...args){ return Contextify(this.#instance.get(...args)); }
  getAll(...args){ return Contextify(this.#instance.getAll(...args)); }
  has(...args){ return Contextify(this.#instance.has(...args)); }
  keys(...args){ return Contextify(this.#instance.keys(...args)); }
  set(...args){ return Contextify(this.#instance.set(...args)); }
  sort(...args){ return Contextify(this.#instance.sort(...args)); }
  toString(...args){ return Contextify(this.#instance.toString(...args)); }
  toJSON(...args){ return Contextify(this.#instance.toJSON(...args)); }
}

global.TextEncoder ??= class TextEncoder
{
  #instance;

  constructor(...args)
  {
    this.#instance = new host.TextEncoder(...args);
    redirects.set(this.#instance, this);
  }

  encode(...args){ return Contextify(this.#instance.encode(...args)); }
  encodeInto(...args){ return Contextify(this.#instance.encodeInto(...args)); }
  get encoding(){ return Contextify(this.#instance.encoding); }
  set encoding(value){ return Contextify(this.#instance.encoding = value); }
}

global.TextDecoder ??= class TextDecoder
{
  #instance;

  constructor(...args)
  {
    this.#instance = new host.TextDecoder(...args);
    redirects.set(this.#instance, this);
  }

  decode(...args){ return Contextify(this.#instance.decode(...args)); }

  get encoding(){ return Contextify(this.#instance.encoding); }
  set encoding(value){ return Contextify(this.#instance.encoding = value); }

  get fatal(){ return Contextify(this.#instance.fatal); }
  set fatal(value){ return Contextify(this.#instance.fatal = value); }

  get ignoreBOM(){ return Contextify(this.#instance.ignoreBOM); }
  set ignoreBOM(value){ return Contextify(this.#instance.ignoreBOM = value); }
}

redirects.set(host.Blob, Blob);
redirects.set(host.Buffer, Buffer);
redirects.set(host.URL, URL);
redirects.set(host.URLSearchParams, URLSearchParams);
redirects.set(host.TextEncoder, TextEncoder);
redirects.set(host.TextDecoder, TextDecoder);
