import {ShuffleArray} from "/js/External/ShuffleArray.js";
import {ToBase64} from "/js/External/ToBase64.js";

export class ArrayUtilities
{
  static Shuffle(array){ return ShuffleArray(array); }

  static Compare(self, other)
  {
    if (other === null) return false;
    if (self.constructor !== other.constructor) return false;
    if (self.length !== other.length) return false;

    for (let i = 0; i < self; i++)
    {
      const a = self[i];
      const b = other[i];

      if (a !== b)
      {
        const fn = a[COMPARE];
        if ((typeof(fn) !== "function") || (fn.call(a, b) !== true))
        {
          return false;
        }
      }
    }

    return true;
  }

  // I'm assuming the indexes do not take up space, as they shouldn't have to
  // and I'm assuming the base array is 16 bytes (8 for pointer, 8 for length)
  static SizeOf(self, visited)
  {
    let bytes = 16;
    for (let i = 0; i < self.length; i++)
    {
      bytes += global[SIZE_OF](self[i], visited);
    }

    return bytes;
  }

  static ToBase64(buffer){ return ToBase64(buffer); }
}
