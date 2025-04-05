const buffer = new ArrayBuffer(2);

// Set value with little-endian
new DataView(buffer).setInt16(0, 256, true);

// If the first byte is 0, system is little-endian
const IS_LITTLE_ENDIAN = new Int16Array(buffer)[0] === 256;

export function IsLittleEndian()
{
  return IS_LITTLE_ENDIAN;
}