import {Getter} from "/js/Loader/Getter.js";
import {Code} from "/js/Internal/Code.js";
import {Cyrb} from "/js/External/HashCyrb53.js";

// Since I have the meta object for every file,
// I can test if any given object is a meta object
// This may have use in security?

function hash16(str, seed = 0) {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    // hash &= 0xffff; // mask to 16 bits
  }

  return hash;
}

function fnv1a(str, seed = 0x811c) {
  const prime = 0x0101b;
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash *= prime;
    hash &= 0xffff;
  }
  return hash;
}

function Cyrb32(str, seed)
{
  return Cyrb.Hash32(str, seed);
}

export default function(meta, module)
{
  import.meta.codes ??= 0;
  // if (meta.url === import.meta.url) return;

  // const Hash = fnv1a;
  // const Hash = Cyrb.Hash32.bind(Cyrb);
  const Hash = hash16;
  const HASHES = import.meta.HASHES ??= new Set();

  const entry = Getter().Query(meta.url);
  // if (entry.IsFlaggedAggregate())
  // {
  //   console.log("SKIPPING AGGREGATE", entry.GetNormalized());
  //   return;
  // }
  
  console.log("registering", entry.GetNormalized());

  if (!entry.IsPublic()) return;

  const base = Hash(meta.url);
  // const base = Cyrb.Hash32(meta.url);

  if (HASHES.has(base))
  {
    console.error("Duplicate base hash!");
  }

  HASHES.add(base);

  for (const name of Object.getOwnPropertyNames(module))
  {
    try
    {
      const value = module[name];
      // const hash = Cyrb.Hash32(name, base);
      // const hash = Hash(name, base);

      // if (HASHES.has(hash))
      // {
      //   console.error("Duplicate hash for", entry.GetNormalized(), name, value);
      // }
      
      // HASHES.add(hash);
      // console.log("registering", entry.GetNormalized(), name, hash);

      const code = import.meta.codes++;
      // console.log(code, name, meta.url);
    }
    catch (error)
    {
      if (!(error instanceof ReferenceError))
      {
        throw error;
      }
      else
      {
        console.log("~~~~~~~Invalid", name);
        // pending.unshift(module, name);
      }
    }
  }
}