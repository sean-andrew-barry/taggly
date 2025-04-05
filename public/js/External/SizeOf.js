const POINTER_SIZE = 8;

// Return an ESTIMATE of an object size in bytes
export function SizeOf(value, visited = new WeakSet())
{
  switch (typeof value)
  {
    case "undefined": return 4; // Tentative estimate
    case "symbol": return 16; // Symbol sizes can vary, this is a rough estimate
    case "boolean": return 4; // While engine-dependent, a 4-byte estimate is reasonable
    case "number": return 8; // IEEE-754 double-precision (8 bytes)
    case "string": return value.length * 2; // 2 bytes per character (UTF-16)
    case "function": return POINTER_SIZE; // Estimating size for a function reference
    case "object":
    {
      if (value === null) return POINTER_SIZE; // Estimating size for a null reference

      // This object has been visited, so let's add the space required for a reference to it.
      if (visited.has(value)) return POINTER_SIZE; 
      visited.add(value);

      if (value instanceof Date)
      {
        return 8; // For the int64 timestamp
      }
      else if (value instanceof RegExp)
      {
        // 12 as an estimate of the flags and internal state like lastIndex
        return SizeOf(value.source, visited) + 12;
      }
      else if (value instanceof Map)
      {
        let size = 8; // For the size metadata
        for (let [key, val] of value)
        {
          size += SizeOf(key, visited); // For the key
          size += SizeOf(val, visited); // For the value
        }

        // Estimating 3 pointers per node for the parent, left, and right
        // This is different if it's a hash table
        size += value.size * (3 * POINTER_SIZE);
        return size;
      }
      else if (value instanceof Set)
      {
        let size = 8; // For the size metadata
        for (let element of value)
        {
          size += SizeOf(element, visited); // Dynamic elements
        }

        // Estimating 3 pointers per node for the parent, left, and right
        // This is different if it's a hash table
        size += value.size * (3 * POINTER_SIZE);
        return size;
      }
      else if (value instanceof Blob)
      {
        return value.size; // The size property gives the blob size in bytes
      }
      else if (value instanceof ArrayBuffer || value instanceof SharedArrayBuffer)
      {
        return value.byteLength;
      }
      else if (ArrayBuffer.isView(value))
      {
        // TODO: The view might not be for the full range of the buffer
        return value.buffer.byteLength;
      }

      let size = 0;
      for (let key in value)
      {
        if (Object.hasOwn(value, key))
        {
          // Check if the key can be converted to an integer
          const is_integer_key = Number.isInteger(Number(key));

          // For object keys that can be integers, we'll assume a smaller storage size.
          size += is_integer_key ? 4 : SizeOf(key, visited);

          // Add value size recursively
          size += SizeOf(value[key], visited);
        }
      }

      return size;
    }
    default:
    {
      throw new Error(`Unknown type "${typeof value}" in SizeOf`);
    }
  }
}