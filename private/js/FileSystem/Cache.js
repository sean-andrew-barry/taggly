import "/flag#frozen";
import "/flag#dangerous";
import "/flag#internal";

const cache = new WeakMap();

export class Cache
{
  static Set(key, value)
  {
    cache.set(key, value);
  }

  static Has(value)
  {
    return cache.has(value);
  }

  static Match(key, value)
  {
    return cache.get(key) === value;
  }

  static Get(entry)
  {
    if (entry === undefined) return;
    if (cache.has(entry)) return cache.get(entry);

    const ctor = cache.get(entry.constructor);
    if (!ctor) return entry; // It shouldn't be reconstructed

    // if (!ctor) throw new Error(`Cannot override unmapped constructor "${entry.constructor.name}"`);

    // if (ctor === entry.constructor)
    // {
    //   console.log("Ctor is unchanged");
    //   return entry;
    // }

    const override = new ctor(entry);
    cache.set(entry, override);

    // override.Clone(entry);

    entry.destructor();

    return override;
  }
}
