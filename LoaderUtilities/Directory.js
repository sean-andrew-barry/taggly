import fs, {promises as fsp} from "fs";
import os from "os";
import {sep} from "path";
import {pathToFileURL} from "url";
import {Entry} from "./Entry.js";
import {File} from "./File.js";
import {Placeholder} from "./Placeholder.js";

const SELF_URL = new URL(import.meta.url);
const SOURCE = Symbol("source");
const WATCHER = Symbol("watcher");

export class Directory extends Entry
{
  static _GetTemp()
  {
    return new Promise((resolve, reject) =>
    {
      fs.mkdtemp(`${os.tmpdir()}${sep}taggly`, (err, directory) =>
      {
        if (err) throw err;
        console.log(directory);
        // Will print something similar to `/tmp/abc123`.
        // A new temporary directory is created within
        // the /tmp directory.
      });
    });
  }

  static Create(url, is_path = false)
  {
    return new Promise((resolve, reject) =>
    {
      fs.stat(url, (error, stats) =>
      {
        if (error) return resolve(undefined);

        if (is_path === true)
        {
          url = pathToFileURL(url);
        }

        let entry;
        if (stats.isDirectory()) entry = new Directory(url);
        else if (stats.isFile()) entry = new File(url);
        else return reject(new Error(`Invalid entry at "${url?.href ?? url}", must be a file or directory`));

        entry.SetStats(stats);

        resolve(entry);
      });
    });
  }

  static Create(url, stats)
  {
    return new Promise((resolve, reject) =>
    {
      fs.stat(url, (error, stats) =>
      {
        if (error) return resolve(new Placeholder(url));

        let entry;
        if (stats.isDirectory()) entry = new Directory(url);
        else if (stats.isFile()) entry = new File(url);
        else return reject(new Error(`Invalid entry at "${url?.href ?? url}", must be a file or directory`));

        entry.SetStats(stats);

        resolve(entry);
      });
    });
  }

  static async Create(url, stats)
  {
    if (stats === undefined)
    {
      try
      {
        stats = await fsp.stat(url);
      }
      catch (error)
      {
        return new Placeholder(url);
      }
    }

    let entry;
    if (stats.isDirectory()) entry = new Directory(url);
    else if (stats.isFile()) entry = new File(url);
    else throw new Error(`Invalid entry at "${url}", must be a file or directory`);

    entry.SetStats(stats);

    return entry;
  }

  static async Create(url, stats)
  {
    if (stats === undefined)
    {
      try
      {
        stats = await fsp.stat(url);

        if (stats)
        {
          const real_path = await fsp.realpath(url);
          const real_url = pathToFileURL(real_path);

          if (real_url.href !== url.href)
          {
            url = real_url;
          }
        }
      }
      catch (error)
      {
        return new Placeholder(url);
      }
    }

    let entry;
    if (stats.isDirectory()) entry = new Directory(url);
    else if (stats.isFile()) entry = new File(url);
    else throw new Error(`Invalid entry at "${url}", must be a file or directory`);

    entry.SetStats(stats);

    return entry;
  }

  NextTick()
  {
    return new Promise(resolve => global.process.nextTick(resolve));
  }

  async UpdateChild(specifier, files, start, loader, event)
  {
    const file = await this.FindChild(specifier);

    if (file)
    {
      const valid = await file.Validate();

      // Because the watcher fires multiple times, the following timing stuff
      // is to filter out the unneeded updates
      const {ctime} = await file.GetStats();
      const update_time = ctime.getTime();

      let prev_time = start;
      if (files.has(file)) // If we've seen this file before
      {
        prev_time = files.get(file); // Load the time of when it last updated
      }

      // Filter out any updates that happen too quickly after a previous update
      if (update_time > prev_time)
      {
        const elapsed = update_time - prev_time;
        files.set(file, update_time);

        if (valid !== true)
        {
          console.log("File isn't valid, so it was deleted?", specifier);

          // Still fire the update, but set the mode to "delete" since we failed to find it
          return loader.FireEvent("OnFileUpdate", {
            cancelable: true,
            entry: undefined,
            directory: this,
            mode: "delete",
            specifier,
          });
        }
        else
        {
          console.log("File update", specifier);

          return loader.FireEvent("OnFileUpdate", {
            cancelable: true,
            entry: file,
            directory: this,
            mode: event,
            elapsed,
            specifier,
          });
        }
      }
    }
    else
    {
      console.log(this.GetName(), "no file found for", specifier);

      // Check if we failed to find it because it is cached as undefined
      const children = this.GetChildren();
      if (children.has(specifier))
      {
        const promise = children.get(specifier);
        const entry = children.get(promise);

        if (entry === undefined)
        {
          console.log("Child file was not found because it was previously marked as undefined", specifier);
          children.delete(specifier);
          children.delete(promise);

          // So try again
          return this.UpdateChild(specifier, files, start, loader, event);
        }
      }
    }
  }

  Initialize()
  {
    fsp.readdir(this).then(names =>
    {
      for (let i = 0; i < names.length; i++)
      {
        this.FindChild(names[i]).then(child =>
        {
          if (child)
          {
            child.Initialize();
          }
        });
      }
    });
  }

  GetEntryNames()
  {
    return new Promise((resolve, reject) =>
    {
      fs.readdir(this, (error, files) =>
      {
        if (error) return reject(error);
        else resolve(files);
      });
    });
  }

  GetEntries()
  {
    return this.GetEntryNames().then(names =>
    {
      // console.log("Got entries", names);
      return Promise.all(names.map(name => this.GetChild(name)));
    });
  }

  GetDirectory()
  {
    const url = pathToFileURL(this.GetPathParent());
    return new this.constructor(url);
  }

  FindChild(name)
  {
    const children = this.GetChildren();
    if (children.has(name))
    {
      return children.get(name);
    }

    let promise;
    promise = new Promise(async (resolve, reject) =>
    {
      const base_path = this.GetPath();
      const path = base_path + sep + name;

      const child = await this.constructor.Create(path, true);

      // If the child does not exist
      if (child === undefined)
      {
        children.set(promise, undefined);
        return resolve(undefined);
      }

      child.SetName(name);
      child.SetLayer(this.GetLayer());
      child.SetDomain(this.GetDomain());
      child.SetLayerIndex(this.GetLayerIndex());
      child.SetParent(this);

      children.set(promise, child);

      return resolve(child);
    });

    children.set(name, promise);

    return promise;
  }

  CreateChild(name)
  {
    const base_path = this.GetPath();
    const path = base_path + sep + name;

    return new Promise((resolve, reject) =>
    {
      fs.stat(path, (error, stats) =>
      {
        const url = pathToFileURL(path);
        if (error) return resolve(new UndefinedFile(url));

        if (is_path === true)
        {
          url = pathToFileURL(url);
        }

        let entry;
        if (stats.isDirectory()) entry = new Directory(url);
        else if (stats.isFile()) entry = new File(url);
        else return reject(new Error(`Invalid entry at "${url?.href ?? url}", must be a file or directory`));

        entry.SetStats(stats);

        resolve(entry);
      });
    });
  }

  FindChild(name)
  {
    const children = this.GetChildren();
    if (children.has(name))
    {
      return children.get(name);
    }

    let promise;
    promise = new Promise(async (resolve, reject) =>
    {
      const base_path = this.GetPath();
      const path = base_path + sep + name;
      const url = pathToFileURL(path);

      const child = await this.constructor.Create(url);

      // If the child does not exist
      if (child === undefined)
      {
        children.set(promise, undefined);
        return resolve(undefined);
      }

      child.SetName(name);
      child.SetLayer(this.GetLayer());
      child.SetDomain(this.GetDomain());
      child.SetLayerIndex(this.GetLayerIndex());
      child.SetVersion(this.GetVersion());
      child.SetInstance(this.GetInstance());
      child.SetParent(this);

      children.set(promise, child);

      return resolve(child);
    });

    children.set(name, promise);

    return promise;
  }

  FindChild(name)
  {
    const lower = name.toLowerCase();
    const children = this.GetChildren();
    if (children.has(lower))
    {
      return children.get(lower);
    }

    let promise;
    promise = new Promise(async (resolve, reject) =>
    {
      const base_path = this.GetPath();
      const path = base_path + sep + name;
      const url = pathToFileURL(path);

      const child = await this.constructor.Create(url);

      // If the child does not exist
      if (child === undefined)
      {
        children.set(promise, undefined);
        return resolve(undefined);
      }

      // if (child.IsFile())
      // {
      //   const real_path = await fsp.realpath(path);
      //   if (real_path !== path)
      //   {
      //     const url = pathToFileURL(real_path);
      //     child.href = url.href;
      //     // console.log(real_path);
      //   }
      // }

      child.SetName(name);
      child.SetLayer(this.GetLayer());
      child.SetDomain(this.GetDomain());
      child.SetLayerIndex(this.GetLayerIndex());
      child.SetVersion(this.GetVersion());
      child.SetInstance(this.GetInstance());
      child.SetParent(this);

      children.set(promise, child);

      return resolve(child);
    });

    children.set(lower, promise);

    return promise;
  }

  _FindChild(name, state)
  {
    const children = this.GetChildren();

    if (children.has(name))
    {
      if (state?.clear === true)
      {
        console.log("Entry got state.clear", this.href, name);
        const promise = children.get(name);
        const entry = children.get(promise);

        if (entry === undefined)
        {
          children.delete(promise);
          children.delete(name);
          return Promise.resolve(undefined);
        }
      }
      else
      {
        return children.get(name);
      }
    }

    let promise;
    promise = new Promise(async (resolve, reject) =>
    {
      const base_path = this.GetPath();
      const path = base_path + sep + name;

      const child = await this.constructor.Create(path, true);

      // If the child does not exist
      if (child === undefined)
      {
        children.set(promise, undefined);
        return resolve(undefined);
      }

      child.SetName(name);
      child.SetLayer(this.GetLayer());
      child.SetDomain(this.GetDomain());
      child.SetLayerIndex(this.GetLayerIndex());
      child.SetParent(this);

      children.set(promise, child);

      return resolve(child);
    });

    children.set(name, promise);

    return promise;
  }

  GetChild(name)
  {
    return this.FindChild(name).then(child =>
    {
      if (child) return child;
      else throw new Error(`Invalid child at "${this.href + "/" + name}", must be a file or directory`);
    });
  }

  async LoadChild(url)
  {
    let stats;
    try
    {
      stats = await fsp.stat(url);
    }
    catch (error)
    {
      return undefined;
    }

    let child;
    if (stats.isDirectory()) child = new Directory(url);
    else if (stats.isFile()) child = new File(url);
    else throw new Error(`Invalid child at "${url.href}", must be a file or directory`)

    child.SetStats(stats);
    child.SetLayer(this.GetLayer());
    child.SetLayerIndex(this.GetLayerIndex());
    child.SetParent(this);

    return child;
  }

  async Try(specifier)
  {
    const url = this.href + specifier;

    let stats;
    try
    {
      stats = await fsp.stat(url);
    }
    catch (error)
    {
      return undefined;
    }

    let child;
    if (stats.isDirectory()) child = new Directory(url);
    else if (stats.isFile()) child = new File(url);
    else throw new Error(`Invalid child at "${url.href}", must be a file or directory`)

    child.SetStats(stats);
    child.SetLayer(this.GetLayer());
    child.SetLayerIndex(this.GetLayerIndex());
    child.SetParent(this);

    return child;
  }

  async CreateChild(name, content)
  {
    const children = this.GetChildren();

    const file = new File(this.pathname + "/" + name, this);

    return file.Write(content);
    // return file;

    // let stats;
    // try
    // {
    //   stats = await fsp.stat(url);
    // }
    // catch (error)
    // {
    //   return resolve(undefined);
    // }
  }

  CreateChildURL(name)
  {
    let url;
    if (this.search)
    {
      const base_url = new URL(this);
      base_url.search = "";

      url = new URL(base_url.href + "/" + name);
      url.search = this.search;
    }
    else
    {
      url = new URL(this.href + "/" + name);
    }

    return url;
  }

  FindChildSync(name)
  {
    // If we have a fully resolved child already stored, return it
    const children = this.GetChildren();
    if (children.has(name))
    {
      const promise = children.get(name);
      if (children.has(promise))
      {
        return children.get(promise);
      }
    }

    const url = this.CreateChildURL(name);

    let stats;
    try
    {
      stats = fs.statSync(url);
    }
    catch (error)
    {
      // Create a dummy promise that just returns undefined
      const promise = Promise.resolve(undefined);
      children.set(name, promise);
      children.set(promise, undefined);
      return;
    }

    let child;
    if (stats.isDirectory()) child = new Directory(url);
    else if (stats.isFile()) child = new File(url);
    else throw new Error(`Invalid child at "${url}", must be a file or directory`);

    child.SetName(name);
    child.SetStats(stats);
    child.SetLayer(this.GetLayer());
    child.SetLayerIndex(this.GetLayerIndex());
    child.SetParent(this);

    // Create a dummy promise that just returns the child
    const promise = Promise.resolve(child);
    children.set(name, promise);
    children.set(promise, child);

    return child;
  }

  GetChildSync(name)
  {
    const child = this.FindChildSync(name);

    if (child) return child;
    else throw new Error(`Invalid child at "${this.href + "/" + name}", must be a file or directory`);
  }

  CreateParts(specifier, domains)
  {
    if (specifier.startsWith("file:///") === true)
    {
      const difference = this.Compare(specifier);
      if (typeof(difference) === "string")
      {
        for (let i = 0; i < domains.length; i++)
        {
          const domain = "/" + domains[i];
          if (difference.startsWith(domain))
          {
            specifier = difference.substring(domain.length);
          }
        }
      }
    }

    return specifier.replace(/^\/|\/$/g, "").split("/");
  }

  Search(importer, parameters, domains, specifier, validate, parts, index = 0)
  {
    if (index >= parts.length)
    {
      return super.Search(importer, parameters, domains, specifier, validate, parts, index);
    }

    const part = parts[index];

    return this.FindChild(part).then(child =>
    {
      if (parts.length <= index) return child;
      else return child?.Search(importer, parameters, domains, specifier, validate, parts, index + 1);
    });
  }

  Query(query, index, state)
  {
    const parts = query.GetParts();
    if (index >= parts.length)
    {
      return super.Query(query, index, state);
    }

    const part = parts[index];
    return this.FindChild(part, state).then(child =>
    {
      if (parts.length <= index) return child;
      else return child?.Query(query, index + 1, state);
    });
  }

  Query(query, index, state)
  {
    const parts = query.GetParts();
    if (index >= parts.length)
    {
      return super.Query(query, index, state);
    }

    const part = parts[index];
    return this.FindChild(part, state).then(child =>
    {
      if (parts.length <= index) return child;
      else return child?.Query(query, index + 1, state);
    });
  }

  async Validate()
  {
    let stats;
    try
    {
      stats = await fsp.stat(this);
    }
    catch (error)
    {
      // No longer exists, so return a placeholder
      return Placeholder.From(this);
    }

    this.SetStats(stats);

    if (stats.isFile())
    {
      // The directory was changed into a file
      return File.From(this, stats);
    }
    else if (stats.isDirectory())
    {
      // Still a directory, so no change
      return this;
    }
  }

  async Query(query, index, state)
  {
    const parts = query.GetParts();
    if (index >= parts.length)
    {
      return super.Query(query, index, state);
    }

    const child = await this.FindChild(parts[index]);
    if (child)
    {
      index += 1;

      // If validate is set and this child is the last child in the query chain
      if (state.validate === true && index >= parts.length)
      {
        const replacement = await child.Validate();
        if (replacement !== child)
        {
          // console.log("Child", child.constructor.name, "got replaced with", replacement.constructor.name);
          await this.ReplaceChild(child, replacement);
          return replacement.Query(query, index, state);
        }
      }

      return child.Query(query, index, state);
    }
  }

  QuerySync(query, index, state)
  {
    console.warn("QuerySync isn't really properly supported at the moment");

    const parts = query.GetParts();
    if (index >= parts.length)
    {
      return super.QuerySync(query, index, state);
    }

    const part = parts[index];
    const child = this.FindChildSync(part);

    if (parts.length <= index) return child;
    else return child?.QuerySync(query, index + 1, state);
  }

  async CreateSource(specifier, loader, domains)
  {
    if (this.pathname.includes(".ignore")) return;

    if (!(specifier instanceof URL))
    {
      specifier = new URL(specifier, this);
    }

    const lines = [];
    // lines.push(`console.log("Executing directory", import.meta.url);`);

    const [start, end] = this.pathname.split("/js/");

    specifier.searchParams.set("next", "true");
    const next_url = `/js/${end}?${specifier.searchParams.toString()}`;

    // Import the next directory in the layer stack, if it exists
    const next = await loader.Search(this, next_url, domains);
    if (next) lines.push(`export * from "${next_url}";`);

    specifier.searchParams.delete("next");

    let recursive = true;
    if (specifier.searchParams.has("recursive") && specifier.searchParams.get("recursive") === "false")
    {
      recursive = false;
    }

    const entries = await this.GetEntries();
    for (let i = 0; i < entries.length; i++)
    {
      const entry = entries[i];
      if (entry.pathname.includes(".ignore")) continue;

      const [start, end] = entry.pathname.split("/js/");
      const import_url = `/js/${end}?${specifier.searchParams.toString()}`;

      const file = await loader.Search(this, import_url, domains);

      if (recursive !== true && file instanceof Directory)
      {
        // console.log("Not importing", import_url);
        continue;
      }

      if (file) lines.push(`export * from "${import_url}";`);
    }

    return Buffer.from(lines.join("\n"), "utf8");
  }

  _GetSource(specifier, loader, domains)
  {
    return this[SOURCE] ??= new Promise(async (resolve, reject) =>
    {
      try
      {
        if (this.pathname.includes(".ignore")) return;

        if (!(specifier instanceof URL))
        {
          specifier = new URL(specifier, this);
        }

        const lines = [];
        // lines.push(`console.log("Executing directory", import.meta.url);`);

        const [start, end] = this.pathname.split("/js/");

        specifier.searchParams.set("next", "true");
        const next_url = `/js/${end}?${specifier.searchParams.toString()}`;

        // Import the next directory in the layer stack, if it exists
        const next = await loader.Search(this, next_url, domains);
        if (next) lines.push(`export * from "${next_url}";`);

        specifier.searchParams.delete("next");

        let recursive = true;
        if (specifier.searchParams.has("recursive") && specifier.searchParams.get("recursive") === "false")
        {
          recursive = false;
        }

        const entries = await this.GetEntries();
        for (let i = 0; i < entries.length; i++)
        {
          const entry = entries[i];
          if (entry.pathname.includes(".ignore")) continue;

          const [start, end] = entry.pathname.split("/js/");
          const import_url = `/js/${end}?${specifier.searchParams.toString()}`;

          const file = await loader.Search(this, import_url, domains);

          if (recursive !== true && file instanceof Directory)
          {
            // console.log("Not importing", import_url);
            continue;
          }

          if (file) lines.push(`export * from "${import_url}";`);
        }

        const source = Buffer.from(lines.join("\n"), "utf8");
        resolve(source);
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  GetCustomSource(specifier, loader, domains)
  {
    return this[SOURCE] ??= new Promise(async (resolve, reject) =>
    {
      try
      {
        if (this.pathname.includes(".ignore")) return;

        if (!(specifier instanceof URL))
        {
          specifier = new URL(specifier, this);
        }

        const lines = [];
        // lines.push(`console.log("Executing directory", import.meta.url);`);

        const [start, end] = this.pathname.split("/js/");

        specifier.searchParams.set("next", "true");
        const next_url = `/js/${end}?${specifier.searchParams.toString()}`;

        // Import the next directory in the layer stack, if it exists
        const next = await loader.Search(this, next_url, domains);
        if (next) lines.push(`export * from "${next_url}";`);

        specifier.searchParams.delete("next");

        let recursive = true;
        if (specifier.searchParams.has("recursive") && specifier.searchParams.get("recursive") === "false")
        {
          recursive = false;
        }

        const entries = await this.GetEntries();
        for (let i = 0; i < entries.length; i++)
        {
          const entry = entries[i];
          if (entry.pathname.includes(".ignore")) continue;

          const [start, end] = entry.pathname.split("/js/");
          const query = specifier.searchParams.toString();
          const import_url = `/js/${end}${query ? "?" + query : ""}`;

          const file = await loader.Search(this, import_url, domains);
          if (file === this)
          {
            // console.log("Matched self");
            continue;
          }

          if (recursive !== true && file instanceof Directory)
          {
            // console.log("Not importing", import_url);
            continue;
          }

          if (file)
          {
            // lines.push(`console.log("Exporting file ${import_url}");`);
            lines.push(`export * from "${import_url}";`);
          }
        }

        // console.log(lines);
        const source = Buffer.from(lines.join("\n"), "utf8");
        resolve(source);
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  Resolve(...parts)
  {
    const base_parts = this.GetHRefParts();

    let matches = 0;
    for (let i = 0; i < parts.length; i++)
    {
      if (parts[i] !== base_parts[i]) break;
      else matches += 1;
    }

    if (matches > 0)
    {
      parts.splice(0, matches);
      // return this.Resolve(...parts);
    }

    // base_parts.push.apply(base_parts, parts);
    //
    // return base_parts;
    return parts;
  }

  Normalize(specifier)
  {
    // console.log("Normalizing", specifier);
    const parts = this.Split(specifier);
    const base_parts = this.GetHRefPartsCopy();

    let matches = 0;
    for (let i = 0; i < parts.length; i++)
    {
      if (parts[i] !== base_parts[i]) break;
      else matches += 1;
    }

    if (matches > 0)
    {
      parts.splice(0, matches);
      // base_parts.splice(matches);
    }

    base_parts.push.apply(base_parts, parts);

    const url = new URL(base_parts.join("/"));

    return url;
  }

  GetStartIndex(parts)
  {
    const own_parts = this.GetParts();
    for (let i = 0; i < parts.length; i++)
    {
      const a = own_parts[i];
      const b = parts[i];

      // Start the search from the first difference found in the split urls
      if (a !== b) return i;
    }
  }

  Find(parent, specifier, sync = false)
  {
    const url = this.Normalize(specifier);
    const parts = url.pathname.replace(/^\/|\/$/g, "").split("/");

    const own_parts = this.GetParts();
    for (let i = 0; i < parts.length; i++)
    {
      const a = own_parts[i];
      const b = parts[i];

      // Start the search from the first difference found in the split urls
      if (a !== b)
      {
        if (sync) return this.SearchSync(parent, url.searchParams, parts, i);
        else      return this.Search    (parent, url.searchParams, parts, i);
      }
    }
  }

  Find(parent, specifier, sync = false)
  {
    const url = this.Normalize(specifier);
    const parts = url.pathname.replace(/^\/|\/$/g, "").split("/");

    const own_parts = this.GetParts();
    for (let i = 0; i < parts.length; i++)
    {
      const a = own_parts[i];
      const b = parts[i];

      // Start the search from the first difference found in the split urls
      if (a !== b)
      {
        if (sync) return this.SearchSync(parent, url.searchParams, parts, i);
        else      return this.Search    (parent, url.searchParams, parts, i);
      }
    }
  }

  FindSync(parent, specifier){ return this.Find(parent, specifier, true); }

  IsDirectory(){ return true; }
}
