import "/flag#static";

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} string the input value
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer}
 */
export function HashFNV1a(string, seed = 0x811c9dc5, stride = 1)
{
  let hval = seed;

  const length = string.length;
  for (let i = 0; i < length; i += stride)
  {
    hval ^= string.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }

  return hval >>> 0;
}
