import {Tag} from "/js/Tag.js";
import {LazyPromise} from "/js/Utility/LazyPromise.js";

export const PROMISE = Symbol("promise");

export class Module extends Tag
{
  constructor(node, classes)
  {
    super(node, classes);
    // console.log("Constructing module", this.constructor.name, "with", config, old_version);
    // this.config = config;
    // this.old_version = old_version;
    // this.Wait(config, old_version);
  }

  async LoadModule(){}

  CompareArray(a, b)
  {
    if (!(b instanceof Array)) return false;

    const end = Math.max(a.length, b.length);
    for (let i = 0; i < end; i++)
    {
      if (!this.Compare(a[i], b[i]))
      {
        console.log(`Found comparison difference between "${a[i]}" and ${b[i]} at index [${i}]`);
        return false;
      }
    }

    return true;
  }

  CompareObject(a, b)
  {
    if ((a === null) || (b === null)) return false;
    if (a instanceof Array) return this.CompareArray(a, b);

    const keys_a = Object.keys(a);
    const keys_b = Object.keys(b);

    const end = Math.max(keys_a.length, keys_b.length);
    for (let i = 0; i < end; i++)
    {
      const key_a = keys_a[i];
      const key_b = keys_b[i];

      if (!this.Compare(a[key_a], b[key_b]))
      {
        console.log(`Found comparison difference between key "${key_a}": ${a[key_a]} and key "${key_b}": ${b[key_b]}`);
        return false;
      }
    }

    return true;
  }

  Compare(a, b)
  {
    if (a === b)
    {
      return true;
    }
    else if ((typeof(a) === "object") && (typeof(b) === "object"))
    {
      return this.CompareObject(a, b);
    }
    else
    {
      return false;
    }
  }

  IsSame(old, key)
  {
    if (!old) throw new Error(`The old Module is required in ${this.constructor.name}.IsSame(old, key)`);
    else return this.Compare(this[key], old[key]) === true;
  }

  Unchanged(old)
  {
    return true;
  }

  GetOldVersion()
  {
    const loader = global.GetLoader();

    if (loader)
    {
      const doc = loader.GetOldDocument();

      if (doc)
      {
        const config = doc.documentElement.tag.Query("config");

        return config.Query(this.GetLocalName());
      }
    }
  }

  async Render(resolve, reject)
  {
    try
    {
      const config = Tag.Get("config");
      const old_version = this.GetOldVersion();

      console.log("Initializing", this.constructor.name);
      await this.LoadModule(config, old_version);

      return super.Render(resolve, reject);
    }
    catch (error)
    {
      reject(error);
    }
  }
}
