import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Environment} from "/js/Utility/Environment.js";

export class Storage extends Singleton
{
  static GetLocalName(){ return "storage"; }
  static GetMetaURL(){ return import.meta.url; }

  #storage;

  constructor(...args)
  {
    super(...args);

    window.addEventListener("beforeunload", this.OnBeforeUnload.bind(this));
    window.setInterval(this.OnSaveInterval.bind(this), this.GetSaveInterval());

    // this.Validate();
    // this.Delete("__taggly_state");
    // this.last_write = Date.now();
    this.SetModified(false);
    // console.log(this.GetStorage());
  }

  GetVersionKey(){ return "__taggly_version"; }
  GetStateKey(){ return "__taggly_state"; }
  GetStateKey(){ return this.GetHash(); }
  GetSaveInterval(){ return 1000; }

  Validate(key = this.GetVersionKey())
  {
    const version = Environment.GetVersion();

    if (this.Has(key))
    {
      const saved_version = this.Get(key);
      if (saved_version !== version)
      {
        console.log("Storage", this.constructor.name, "is outdated", "old is", saved_version, "current is", version);
      }
    }
    else
    {
      this.Set(key, version);
      console.log("Setting storage version");
    }
  }

  CreateState(key = this.GetStateKey())
  {
    if (this.Has(key))
    {
      return JSON.parse(this.Get(key));
    }
    else
    {
      return {};
    }
  }

  GetState(){ return this.state ??= this.CreateState(); }

  IsStorageAvailable(type)
  {
    let storage;
    try
    {
      storage = window[type];
      const test = "__storage_test__";
      storage.setItem(test, test);
      storage.removeItem(test);

      return true;
    }
    catch (error)
    {
      if (error instanceof window.DOMException)
      {
        if (error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
        {
          if (storage && storage.length !== 0)
          {
            return true;
          }
        }
      }

      return false;
    }
  }

  CreateStorage(){ throw new Error(`Storage.CreateStorage should be overridden by an extension class`); }
  GetStorage(){ return this.#storage ??= this.CreateStorage(); }

  GetVersion(){ return Environment.GetVersion(); }
  Set(key, value){ this.GetStorage()?.setItem(key, value); return this; }
  Get(key){ return this.GetStorage()?.getItem(key); }
  Has(key){ return !!this.Get(key); }
  Delete(key){ this.GetStorage()?.removeItem(key); return this; }
  Clear(){ this.GetStorage()?.clear(); return this; }
  GetLength(){ return this.GetStorage()?.length ?? 0; }
  IsEmpty(){ return this.GetLength() === 0; }

  IsModified(){ return this.modified === true; }
  SetModified(value){ this.modified = value; return this; }

  Try(key, value)
  {
    if (this.Has(key))
    {
      return false;
    }
    else
    {
      this.Set(key, value);
      return true;
    }
  }

  KeyToString(key)
  {
    switch (typeof(key))
    {
      case "string": return key;
      case "object":
      {
        if (key instanceof Tag)
        {
          return key.constructor.GetHash();
        }
        else if (key.prototype instanceof Tag)
        {
          return key.GetHash();
        }
      }
      default: return key.toString();
    }
  }

  Find(keys)
  {
    const length = keys.length - 1;

    let current = this.GetState();
    for (let i = 0; i < length; i++)
    {
      const key = this.KeyToString(keys[i]);

      if (!current.hasOwnProperty(key))
      {
        current[key] = {};
        this.SetModified(true);
      }

      current = current[key];
    }

    return {
      storage: current,
      key: keys[length],
    };
  }

  Read(...keys)
  {
    const {storage, key} = this.Find(keys);
    return storage[key];
  }

  Write(...keys)
  {
    const value = keys.pop();

    const {storage, key} = this.Find(keys);

    this.SetModified(true);

    return storage[key] = value;
  }

  Erase(...keys)
  {
    const {storage, key} = this.Find(keys);
    delete storage[key];
  }

  Save()
  {
    if (!this.IsModified()) return this;

    const string = JSON.stringify(this.GetState(), undefined, 2);
    this.Set(this.GetStateKey(), string);

    this.SetModified(false);

    // console.log("Saved", string);

    return this;
  }

  OnBeforeUnload(event)
  {
    this.Save();
  }

  OnSaveInterval(event)
  {
    if (this.IsModified())
    {
      this.Save();
    }
  }
}
