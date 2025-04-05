import {Tag} from "/js/Tag.js";
import {Environment} from "/js/Utility/Environment.js";
import {Config} from "/js/Tags/Config.js";

const PROMISE = import("/js/Tags/Cache.js").then(m => m.Cache.New()); // Singleton
// let instance;
export class Cache extends Tag
{
  static Get(){ return PROMISE; }
  // static Get(){ return instance; }

  static LoadLocalStorage()
  {
    let storage;
    try
    {
      storage = window.localStorage;
      const test = "__storage_test__";
      storage.setItem(test, test);
      storage.removeItem(test);

      return storage;
    }
    catch (error)
    {
      if (error instanceof window.DOMException)
      {
        if (error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
        {
          if (storage && storage.length !== 0)
          {
            return storage;
          }
        }
      }

      return undefined;
    }
  }

  Reload()
  {
    if (window.localStorage)
    {
      this.version = window.localStorage.getItem("version");

      if (this.version !== url)
      {
        window.localStorage.setItem("version", url);

        // Reload the current page without the browser cache
        window.location.reload(true);
      }
    }
  }

  async Resolve(source)
  {
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = await source[key];

      if (typeof(val) === "object" && val !== null)
      {
        source[key] = await this.Resolve(val);
        // target[key] = await this.Resolve(val, new val.constructor());
      }
      else
      {
        source[key] = val;
      }
    }

    return source;
  }

  Clear()
  {
    // this.Fire("OnCacheClear", undefined, event =>
    // {
    //   if (this.storage)
    //   {
    //     this.storage.clear();
    //   }
    // });

    if (this.storage)
    {
      this.storage.clear();
    }

    return this;
  }

  constructor(...args)
  {
    super(...args);

    // this.last_saved = undefined;
    // this.storage = this.CreateStorage();
    // this.loaded = this.Load();
    //
    // window.addEventListener("unload", event =>
    // {
    //   event.preventDefault();
    //   this.Save();
    // });
  }

  #storage;
  #session;

  IsLocalStorage(){ return this.GetStorage() === window.localStorage; }
  IsSessionStorage(){ return this.GetStorage() === window.sessionStorage; }
  GetStorageType(){ return window.localStorage; }

  CreateStorage()
  {
    let storage;
    try
    {
      storage = this.GetStorageType();
      const test = "__storage_test__";
      storage.setItem(test, test);
      storage.removeItem(test);

      return storage;
    }
    catch (error)
    {
      if (error instanceof window.DOMException)
      {
        if (error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
        {
          if (storage && storage.length !== 0)
          {
            return storage;
          }
        }
      }

      return undefined;
    }

    return storage;
  }

  GetStorage(){ return this.#storage ??= this.CreateStorage(); }

  Version(v){ return this.SetAttribute("version", v); }

  async CreateStorage()
  {
    const config = Config.Get();

    await this.Wait();

    let version;
    if (this.HasAttribute("version"))
    {
      version = this.GetAttribute("version");
    }
    else
    {
      version = await config.GetVersion();
      this.Version(version);
    }

    // Give the test version a different name so it gets a different session
    if (Environment.IsInlineFrame())
    {
      version = version + "_inline";
    }

    // console.log("Creating storage with version", version);

    return this.constructor.LoadLocalStorage();

    // if (storage)
    // {
    //   // // this.Clear();
    //   await this.Load();
    //
    //   window.addEventListener("unload", event =>
    //   {
    //     event.preventDefault();
    //     this.Save();
    //   });
    // }

    // return storage;
  }

  async Render()
  {
    const config = await Config.Get().Wait();

    if (await config.UseCache())
    {

      if (global.GetVersion)
      {
        const version = global.GetVersion();

        if (typeof(version) === "string")
        {
          this.url = version;
          this.version = version.replace(/.*?\?([\d+\.]+)/, "$1");
          this.parts = this.version.split(".").map(part => Number(part));
        }
        else if (Array.isArray(version))
        {
          this.version = version.join(".");
          this.parts = version;
        }

        // Give the test version a different name so it gets a different session
        if (Environment.IsInlineFrame())
        {
          this.version = this.version + "_inline";
        }

        this.Version(this.version);
      }

      // console.log("Cache version", this.version);

      this.last_saved = undefined;
      this.storage = this.constructor.LoadLocalStorage();

      if (this.storage)
      {
        // // this.Clear();
        this.Load();

        window.addEventListener("unload", event =>
        {
          event.preventDefault();
          this.Save();
        });
      }
    }

    return super.Render();
  }

  async Load()
  {
    const storage = await this.GetStorage();
    const html = storage.getItem(this.GetVersion());

    // console.log("Loading cache", html, this.GetVersion());
    if (html)
    {
      const temp = window.document.createElement("div");
      temp.innerHTML = html;

      if (temp.firstChild)
      {
        const tag = this.Convert(temp.firstChild);
        this.AppendChild(tag);
      }
    }
  }

  async Save()
  {
    const storage = await this.GetStorage();

    storage.setItem(this.GetVersion(), this.GetInnerHTML());
    return this;
  }

  LoadCache()
  {
    if (!this.storage) return;

    const json = this.storage.getItem(this.GetVersion());

    if (typeof(json) === "string")
    {
      const data = JSON.parse(json);

      this.cache = data.cache || this.cache;
      this.times = data.times || this.times;
      this.last_saved = data.last_saved || this.last_saved;

      const event = new Event("CacheLoad");
      event.data = data;
      window.dispatchEvent(event);

      // console.log("Loaded cached data", this);
    }
  }

  async _Save()
  {
    if (!this.storage) return;

    this.last_saved = Date.now();

    const data = await this.Resolve({
      cache: this.cache,
      times: this.times,
      last_saved: this.last_saved,
    });

    const event = new Event("CacheSave");
    event.data = data;
    window.dispatchEvent(event);

    this.storage.setItem(this.GetVersion(), JSON.stringify(data, undefined, 2));
  }

  Select(keys)
  {
    let cache = this.cache;
    let times = this.times;
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      cache = cache[key] || (cache[key] = {});
      times = times[key] || (times[key] = {});
    }

    return {cache, times};
  }

  Set(lifetime, keys, value)
  {
    const {cache, times} = this.Select(keys);

    times[key] = (lifetime * 1000) + Date.now();
    cache[key] = Promise.resolve(value);

    return cache[key];
  }

  Get(lifetime, keys, callback)
  {
    const key = keys.pop();
    const {cache, times} = this.Select(keys);

    // Check if the value has an expiration timestamp
    if (times.hasOwnProperty(key) && (typeof(times[key]) === "number") && (Date.now() > times[key]))
    {
      // console.log("Cache data", key, "has expired, removing it", cache[key]);

      // Remove the expired value from both
      delete cache[key];
      delete times[key];
    }

    const value = cache[key];
    if (value instanceof Promise)
    {
      // console.log("Returning existing promise from cache", key);
      return value;
    }
    else
    {
      // console.log("Returning new promise from cache", key, value);
      times[key] = (lifetime * 1000) + Date.now();
      cache[key] = Promise.resolve(value).then(callback);

      return cache[key];
    }
  }

  Delete(keys)
  {
    if (keys.length === 0) throw new Error(`Cache.Delete must be given at least one key`);

    // console.log("Deleting", keys);
    const key = keys.pop();
    const {cache, times} = this.Select(keys);

    const value = cache[key];

    delete cache[key];
    delete times[key];

    return value;
  }

  // GetUrl(){ return this.url; }
  GetVersion(){ return this.GetAttribute("version"); }
  GetStorage(){ return this.storage; }
  // GetMajor(){ return this.parts[0]; }
  // GetMinor(){ return this.parts[1]; }
  // GetPatch(){ return this.parts[2]; }

  // Version(v){ return this.SetAttribute("version", v); }

  Compare(a, b)
  {
    if (a.GetLocalName() !== b.GetLocalName()) return false;

    const attributes = a.GetAttributes();
    for (let i = 0; i < attributes.length; i++)
    {
      const {name, value} = attributes[i];

      if (!b.HasAttribute(name) || b.GetAttribute(name) !== value)
      {
        return false;
      }
    }

    return true;
  }

  Search(tag)
  {
    const count = this.GetChildCount();
    for (let i = 0; i < count; i++)
    {
      const child = this.GetChild(i);
      if (child && this.Compare(tag, child))
      {
        return child;
      }
    }
  }

  Get(tag, callback)
  {
    const count = this.GetChildCount();
    // console.log("Getting", this.GetOuterHTML(), this.GetNode().children[0]);

    for (let i = 0; i < count; i++)
    {
      const child = this.GetChild(i);
      if (child && this.Compare(tag, child))
      {
        const result = callback(child);
        if (result) return result;
        // return callback(child);
      }
    }

    // console.log("Failed to find a cached match in", this.GetNode());

    // Failed to find a cached match
    const result = callback(tag);
    this.Add(result);

    return result;
  }

  Get(query, callback)
  {
    const count = this.GetChildCount();
    // console.log("Getting", query);
    // console.log("Getting", this.GetOuterHTML(), this.GetNode().children[0]);

    const result = this.Query(query);
    if (result) return result;

    // console.log("Failed to find a cached match in", this.GetNode());

    // Failed to find a cached match
    const tag = callback();
    this.Add(tag);

    return tag;
  }
}

async function Example()
{
  const blog_post = Tag.BlogPost().Name("==", "a-blog-post").Cache(1000).Search(client);
  const query_1 = Tag.Cache().QueryAll(`blog-post[name="a-blog-post"]`);

  const blog_posts = Tag.BlogPost().Name("==", "a-blog-post").Cache(1000).Filter(client);
  const query_2 = Tag.Cache().QueryAll(`blog-post[name="a-blog-post"]`);
}
