import "/flag#dangerous";
// import "/flag#frozen";

import FS, {promises as FSP} from "node:fs";
import zlib from "node:zlib";
import {Entry} from "/js/FileSystem/Entry.js";
import {Directory} from "/js/FileSystem/Entry/Directory.js";
import {Placeholder} from "/js/FileSystem/Entry/Placeholder.js";
import {Cyrb} from "/js/External/HashCyrb53.js";
import {ExtensionToMimeType} from "/js/External/ExtensionToMimeType.js";

const ENCODING = "utf8";
// const JAVASCRIPT = Buffer.from(`\nimport * as __MODULE from "@self";\nimport __REGISTER from "@register";\n__REGISTER(import.meta, __MODULE);`, ENCODING);

export class File extends Entry
{
  #bytes = 0;
  #lines = 0;
  #gzip;
  #deflate;
  #module_cached_data;
  #data;
  #etag;

  constructor(source, parent)
  {
    super(source, parent);

    if (source.IsFile?.())
    {
      this.#bytes = source.GetBytes();
      this.#lines = source.GetLines();

      if (source.HasData()) this.#data = source.GetData();
      if (source.HasETag()) this.#etag = source.GetETag();
      if (source.HasGZip()) this.#gzip = source.GetGZip();
      if (source.HasDeflate()) this.#deflate = source.GetDeflate();
      if (source.HasModuleCachedData()) this.#module_cached_data = source.GetModuleCachedData();
    }
  }

  GetSize(){ return this.#bytes; }
  GetBytes(){ return this.#bytes; }

  GetLines(){ return this.#lines; }

  HasModuleCachedData(){ return this.#module_cached_data !== undefined; }
  GetModuleCachedData(){ return this.#module_cached_data; }
  SetModuleCachedData(module_cached_data){ return this.#module_cached_data = module_cached_data; }

  Load(url)
  {
    const result = super.Load();

    return result;
  }

  Erase()
  {
    return new Promise((resolve, reject) =>
    {
      FS.writeFile(this, "", (error) =>
      {
        if (error) return reject(error);
        return resolve(this);
      });
    });
  }

  Delete()
  {
    return new Promise((resolve, reject) =>
    {
      FS.unlink(this, (error) =>
      {
        if (error) return reject(error);
        return resolve(this);
      });
    });
  }

  GetDirectory()
  {
    const parent = this.GetParent();
    if (parent) return parent;

    const url = pathToFileURL(this.GetPathParent());
    return new Directory(url);
  }

  Read(encoding = "utf-8")
  {
    return new Promise((resolve, reject) =>
    {
      FS.readFile(this, { encoding }, (error, data) =>
      {
        if (error) return reject(error);
        else return resolve(data);
      });
    });
  }

  ReadSync(encoding = "utf-8")
  {
    return FS.readFileSync(this, encoding);
  }

  Write(content)
  {
    return new Promise((resolve, reject) =>
    {
      FS.writeFile(this, content, (error) =>
      {
        if (error) return reject(error);
        else return resolve(this);
      });
    });
  }

  async *[Symbol.asyncIterator]()
  {
    for await (const chunk of FS.createReadStream(this))
    {
      yield chunk;
    }
  }

  ConcatDataChunks(chunks)
  {
    // switch (this.GetMimeType())
    // {
    //   case "text/javascript":
    //   {
    //     const specifier = this.GetSpecifier();
    //     if (specifier.includes("ErrorHandler.js")) break;

    //     // chunks.push(JAVASCRIPT);
    //     // chunks.push(
    //     //   // Buffer.from(`\nimport * as __MODULE from "@self";\nimport __REGISTER from "/js/Loader/Register.js";\n__REGISTER(import.meta, __MODULE);`, ENCODING),
    //     //   Buffer.from(`\nimport * as __MODULE from "${specifier}";\nimport __REGISTER from "/js/Loader/Register.js";\n__REGISTER(import.meta, __MODULE);`, ENCODING),
    //     // );

    //     break;
    //   }
    // }

    return Buffer.concat(chunks);
  }

  async CreateData()
  {
    // fall back to fast path if another caller already loaded sync
    if (this.#data) return this.#data;

    const buffer = await FSP.readFile(this);
    this.#bytes = buffer.byteLength;
    this.#lines = this.CountBufferLines(buffer);
    return buffer;
  }

  CreateDataSync() {
    const buffer = FS.readFileSync(this);
    this.#bytes = buffer.byteLength;
    this.#lines = this.CountBufferLines(buffer);
    return buffer;
  }

  HasData() { this.Assert(); return this.#data !== undefined; }
  GetData() { this.Assert(); return this.#data ??= this.CreateData(); }
  GetDataSync() { this.Assert(); return this.#data ??= this.CreateDataSync(); }

  async CreateETag()
  {
    const data = await this.GetData();
    const hash = Cyrb.Hash53(data);

    return hash.toString(16);
  }

  CreateETagSync()
  {
    const data = this.GetDataSync();
    const hash = Cyrb.Hash53(data);

    return hash.toString(16);
  }

  HasETag() { this.Assert(); return this.#etag !== undefined; }
  GetETag() { this.Assert(); return this.#etag ??= this.CreateETag(); }
  GetETagSync() { this.Assert(); return this.#etag ??= this.CreateETagSync(); }

  CreateGZip()
  {
    return new Promise(async (resolve, reject) =>
    {
      const data = await this.GetData();

      zlib.gzip(data, (error, result) =>
      {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  CreateDeflate()
  {
    return new Promise(async (resolve, reject) =>
    {
      const data = await this.GetData();

      zlib.deflate(data, (error, result) =>
      {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  HasGZip(){ return this.#gzip !== undefined; }
  HasDeflate(){ return this.#deflate !== undefined; }

  GetGZip(){ return this.#gzip ??= this.CreateGZip(); }
  GetDeflate(){ return this.#deflate ??= this.CreateDeflate(); }

  GetMimeType(){ return ExtensionToMimeType(this.GetExtension()); }


  // // Used in finding the shortest path
  // GetWeight()
  // {
  //   const size = this.GetBytes();

  //   // Static files are artificially much heavier, so that they are avoided
  //   // when possible
  //   if (!this.IsStatic()) return size;
  //   else return Math.max(1_000_000, size * 10);
  // }

  // Dijkstra(target = this.GetLoader()?.GetStart())
  // {
  //   if (!target) throw new Error(`No target entry was provided`);

  //   const parents = new Map();
  //   const weights = new Map();
  //   const queue = [];

  //   queue.push(this);
  //   weights.set(this, 0);

  //   queue.push(target);
  //   weights.set(target, Infinity);

  //   const Sort = (a, b) =>
  //   {
  //     return weights.get(b) - weights.get(a);
  //   }

  //   const processed = new Set();

  //   let reached_target = false;
  //   while (queue.length > 0)
  //   {
  //     queue.sort(Sort);

  //     const current = queue.pop();
  //     if (current === target)
  //     {
  //       reached_target = true;
  //       break; // Done
  //     }

  //     if (processed.has(current))
  //     {
  //       console.log("Already processed");
  //       continue;
  //     }

  //     const weight = weights.get(current);

  //     // The references are entries that import `current`
  //     for (const ref of current.GetReferences())
  //     {
  //       if (ref.IsFrozen()) continue;

  //       const new_weight = weight + ref.GetWeight();

  //       if (!weights.has(ref) || weights.get(ref) > new_weight)
  //       {
  //         queue.push(ref);

  //         weights.set(ref, new_weight);
  //         parents.set(ref, current);
  //       }
  //     }

  //     processed.add(current);
  //   }

  //   // Return an empty path if we failed to find the target
  //   // This can happen because of files being frozen
  //   if (reached_target !== true)
  //   {
  //     return [];
  //   }

  //   const path = [target];

  //   let parent = parents.get(target);
  //   while (parent)
  //   {
  //     path.unshift(parent);
  //     if (parent === this) break;

  //     parent = parents.get(parent);
  //   }

  //   if (path.at(0) !== this)
  //   {
  //     console.warn("No parent for", this.GetNormalized());
  //   }

  //   // console.log("Checked", processed.size, "nodes. Distance is", weights.get(target), "Avoided expanding", queue.length, "nodes");

  //   return path;
  // }

  // Increment this file and every file that directly imports it
  // back to the start file

  IsFile(){ return true; }

  async GetSourceEscaped()
  {
    const text = await this.Read(); // super.GetSource instead?

    let source = "";
    for (let i = 0; i < text.length; i++)
    {
      source += this.Escape(text[i]);
    }

    return source;
  }

  async GetSource()
  {
    console.warn("GetSource is depreciated");

    switch (this.GetMimeType())
    {
      case "text/javascript":
      {
        return super.GetSource();
      }
      case "text/html":
      {
        // TODO: What about using Template instead of Fragment?
        return `import {Fragment} from "/js/Tags/Fragment.js";\n\nexport default new Fragment().InnerHTML("${await this.GetSourceEscaped()}");`;
      }
      case "text/css":
      {
        return `import {Style} from "/js/Tags/Style.js";\n\nexport default new Style().Text("${await this.GetSourceEscaped()}");`;
      }
      default:
      {
        return `export default "${await this.GetSourceEscaped()}";`;
      }
    }
  }

  async Refresh()
  {
    // console.log("Refreshing File", this.GetNormalized());

    this.Assert();

    const parent = this.GetParent();
    const stats = await FSP.stat(this).catch(() => undefined);

    if (!stats)
    {
      // console.log("File was removed, swapping for a placeholder");

      // Was removed
      const placeholder = new Placeholder(this, parent);
      parent.ReplaceChild(this, placeholder);
      this.destructor();

      return placeholder;
    }

    if (stats.isFile())
    {
      // console.log("File is still a file...");

      const old_stats = this.GetStats();
      this.SetStats(stats);

      if (old_stats && stats.mtime > old_stats.mtime)
      {
        if (this.IsFrozen()) return this;

        const old_etag = await this.GetETag();
        
        this.#data = undefined;
        this.#etag = undefined;
        
        const new_etag = await this.GetETag();

        // console.log(old_etag, new_etag);
    
        if (new_etag === old_etag)
        {
          return this; // No need to continue with the update
        }
    
        this.#gzip = undefined;
        this.#deflate = undefined;
        this.#module_cached_data = undefined;
    
        const checked = new WeakSet();
        this.Increment(checked);
        this.Rereference(checked);

        // console.log("File updated", this.GetNormalized(), old_etag, new_etag);
      }

      // Still a file, so no change
      return this;
    }
    else if (stats.isDirectory())
    {
      const replacement = new Directory(this, parent);
      replacement.SetStats(stats);

      // Was changed into a directory
      parent.ReplaceChild(this, replacement);

      this.destructor();
      return replacement;
    }
    else
    {
      return this;
    }
  }

  RefreshSync()
  {
    // console.log("Refreshing File", this.GetNormalized());

    this.Assert();

    const parent = this.GetParent();
    const stats = FS.statSync(this, { throwIfNoEntry: false });

    if (!stats)
    {
      // console.log("File was removed, swapping for a placeholder");

      // Was removed
      const placeholder = new Placeholder(this, parent);
      parent.ReplaceChild(this, placeholder);
      this.destructor();

      return placeholder;
    }

    if (stats.isFile())
    {
      // console.log("File is still a file...");

      const old_stats = this.GetStats();
      this.SetStats(stats);

      if (old_stats && stats.mtime > old_stats.mtime)
      {
        if (this.IsFrozen()) return this;

        const old_etag = this.GetETagSync();
        
        this.#data = undefined;
        this.#etag = undefined;
        
        const new_etag = this.GetETagSync();

        // console.log(old_etag, new_etag);
    
        if (new_etag === old_etag)
        {
          return this; // No need to continue with the update
        }
    
        this.#gzip = undefined;
        this.#deflate = undefined;
        this.#module_cached_data = undefined;
    
        const checked = new WeakSet();
        this.Increment(checked);
        this.Rereference(checked);

        // console.log("File updated", this.GetNormalized(), old_etag, new_etag);
      }

      // Still a file, so no change
      return this;
    }
    else if (stats.isDirectory())
    {
      const replacement = new Directory(this, parent);
      replacement.SetStats(stats);

      // Was changed into a directory
      parent.ReplaceChild(this, replacement);

      this.destructor();
      return replacement;
    }
    else
    {
      return this;
    }
  }
}