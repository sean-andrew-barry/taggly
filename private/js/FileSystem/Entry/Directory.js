import "/flag#dangerous";
// import "/flag#frozen";

import FS, {promises as FSP} from "node:fs";
import {Entry} from "/js/FileSystem/Entry.js";
import {File} from "/js/FileSystem/Entry/File.js";
import {Placeholder} from "/js/FileSystem/Entry/Placeholder.js";

const SOURCE = Symbol("source");

export class Directory extends Entry
{
  constructor(source, parent)
  {
    super(source, parent);

    if (source.IsDirectory?.())
    {
      for (const [name, child] of source.GetChildren())
      {
        const rebuilt = this.Rebuild(child);
        rebuilt.SetParent(this);

        this.#children.set(name, rebuilt);
      }
    }
  }

  #children = new Map();
  GetChildren(){ return this.#children; }

  async Initialize()
  {
    for (const name of await FSP.readdir(this))
    {
      const child = await this.FindChild(name);

      if (child)
      {
        child.Initialize();
      }
    }
  }

  GetEntryNames()
  {
    return new Promise((resolve, reject) =>
    {
      FS.readdir(this, (error, files) =>
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

  FindChild(name, directory_ctor = Directory, file_ctor = File)
  {
    if (typeof(name) !== "string")
    {
      throw new Error(`Directory.FindChild expected parameter name to be a string, but got "${name}"`);
    }

    const children = this.GetChildren();

    const lower = name.toLowerCase();
    if (children.has(lower))
    {
      return children.get(lower);
    }

    let child;

    const url = new URL(this.href + "/" + name);
    const stats = FS.statSync(url, { throwIfNoEntry: false });

    if (stats)
    {
      if (stats.isDirectory()) child = new directory_ctor(url, this);
      else if (stats.isFile()) child = new file_ctor(url, this);
      else throw new Error(`Unknown entry at "${url}", expected a file or directory`);

      child.SetStats(stats);
    }
    else
    {
      child = new Placeholder(url, this);
    }

    child.SetName(name);
    child.SetParent(this);

    children.set(lower, child);

    return child;
  }

  GetChild(name)
  {
    const child = this.FindChild(name);

    if (child) return child;
    else throw new Error(`Invalid child at "${this.href + "/" + name}", must be a file or directory`);
  }

  RemoveChild(child)
  {
    const children = this.GetChildren();
    const name = child.GetName();
    const lower = name.toLowerCase();

    if (children.has(lower))
    {
      children.delete(name);
      // child.destructor();
      return;
    }

    throw new Error(`Failed to remove child "${child.GetNormalized()}" from parent "${this.GetNormalized()}"`);
  }

  ReplaceChild(child, replacement)
  {
    this.RemoveChild(child);

    const name = replacement.GetName();
    const lower = name.toLowerCase();

    const children = this.GetChildren();
    children.set(lower, replacement);
  }

  Query(query, domains, state, index)
  {
    const parts = query.GetParts();
    if (index >= parts.length)
    {
      return super.Query(query, domains, state, index);
    }

    if (!parts[index])
    {
      return;
    }

    const child = this.FindChild(parts[index]);
    if (child)
    {
      index += 1;
      return child.Query(query, domains, state, index);
    }
  }

  async _CreateSource(specifier, loader, domains)
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

  _GetCustomSource(specifier, loader, domains)
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

  IsDirectory(){ return true; }

  async Refresh()
  {
    // console.log("Refreshing Directory", this.GetNormalized());

    this.Assert();

    const parent = this.GetParent();
    const stats = await FSP.stat(this).catch(() => undefined);

    // It was removed
    if (!stats) 
    {
      const replacement = new Placeholder(this, parent);
      parent.ReplaceChild(this, replacement);
      this.destructor();

      return replacement;
    }

    if (stats.isFile())
    {
      const replacement = new File(this, parent);
      replacement.SetStats(stats);
      
      // Was changed into a file
      parent.ReplaceChild(this, replacement);

      this.destructor();

      return replacement;
    }
    else
    {
      const old_stats = this.GetStats();
      this.SetStats(stats);

      if (old_stats && stats.mtime > old_stats.mtime)
      {
        for (const [name, child] of this.GetChildren())
        {
          await child.Refresh();
        }
      }

      return this;
    }
  }
}
