import "/flag#static";

// NOTE: Full credit for this function to:
// https://stackoverflow.com/a/52171480
// Thank you!
export function Hash(string, seed = 0, limit)
{
  // Optionally limit the string length for performance
  if ((typeof(limit) === "number") && (string.length > limit))
  {
    string = string.slice(0, limit);
  }

  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0; i < string.length; i++)
  {
    const ch = string.charCodeAt(i);

    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);

  return [h2 >>> 0, h1 >>> 0];

  // return h1 >>> 0;
  // return 4294967296 * (2097151 & h2) + (h1 >>> 0);

  // // Convert it to hexadecimal
  // return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
