import "/flag#dangerous";

import FS, {promises as FSP} from "fs";
import {fileURLToPath, pathToFileURL} from "url";
import NodePath from "path";

import {FileSystemObserver as Base} from "/js/Observer/FileSystemObserver.js?after=/taggly/private/";
import {Loader} from "/js/Loader.js";
import {Getter} from "/js/Loader/Getter.js";

export class FileSystemObserver extends Base
{
  #next_update;
  #watchers = [];
  #entries = new Map();

  // _constructor(...args)
  // {
  //   super(...args);

  //   console.log("Constructing FSO");

  //   const loader = Loader.Get();
  //   // const loader = Getter();

  //   for (const layer of loader.GetLayers())
  //   {
  //     const layer_path = layer.GetPath();
  //     const watcher = FS.watch(layer, this.GetWatcherOptions(layer), async (event, specifier) =>
  //     {
  //       if (!specifier) return;

  //       const path = NodePath.resolve(layer_path, specifier);
  //       let type;
  //       // let stats;

  //       const stats = await FSP.stat(path, { throwIfNoEntry: false });

  //       if (!stats)
  //       {
  //         type = "removed";
  //       }
  //       else if (stats.birthtimeMs === stats.mtimeMs)
  //       {
  //         type = "created";
  //       }
  //       else
  //       {
  //         type = "updated";
  //       }

  //       if (this.#entries.has(path))
  //       {
  //         const entry = this.#entries.get(path);

  //         entry.stats = stats; // Always use the most recent stats

  //         // Updated shouldn't override either of the other two types
  //         if (type !== "updated")
  //         {
  //           entry.type = type;
  //         }

  //         // if (entry.type === "removed" && type)

  //         // // Add the update type if it isn't already in there
  //         // // QUESTION: Should I just use a set for this?
  //         // if (!entry.types.includes(type))
  //         // {
  //         //   entry.types.push(type);
  //         // }
  //       }
  //       else
  //       {
  //         this.#entries.set(path, {
  //           stats,
  //           event,
  //           // types: [type],
  //           type,
  //           path,
  //           url: pathToFileURL(path),
  //           specifier,
  //           // domains: this.domains,
  //           layer,
  //         });
  //       }

  //       this.#next_update ??= globalThis.setTimeout(() =>
  //       {
  //         this.#next_update = undefined;

  //         // Reconstruct it instead of using .clear() because the OnFileSystem
  //         // method can be async
  //         const entries = this.#entries;
  //         this.#entries = new Map();

  //         // console.log(entries);

  //         this.OnFileSystem(entries).catch(error =>
  //         {
  //           // this.Throw(error);
  //           throw error;
  //         });
  //       }, this.GetUpdateDelay());
  //     });

  //     this.#watchers.push(watcher);
  //   }
  // }

  constructor(...args)
  {
    super(...args);

    for (const layer of Getter().GetLayers())
    {
      const layer_path = layer.GetPath();
      const watcher = FS.watch(layer, this.GetWatcherOptions(layer), async (event, specifier) =>
      {
        if (!specifier) return;

        const path = NodePath.resolve(layer_path, specifier);
        const url = pathToFileURL(path);

        const loader = Getter();
        const entry = loader.Query(url);

        if (entry)
        {
          await entry.Refresh();
        }
      });

      this.#watchers.push(watcher);
    }
  }

  destructor(...args)
  {
    for (const watcher of this.#watchers)
    {
      watcher.close();
    }

    this.#watchers = [];

    this.CancelNextUpdate();

    return super.destructor(...args);
  }

  GetUpdateDelay(){ return 100; }
  IsPersistent(){ return false; }
  IsRecursive(){ return true; }
  GetWatcherOptions()
  {
    return {
      persistent: this.IsPersistent(),
      recursive: this.IsRecursive(),
    };
  }

  CancelNextUpdate()
  {
    if (this.#next_update)
    {
      globalThis.clearTimeout(this.#next_update);
      this.#next_update = undefined;
      return true;
    }

    return false;
  }

  OnEntryUpdated(state, entry)
  {
    // console.log("Marking", entry.GetNormalized(), "as changed");

    // entry.SetChanged(true);
    return entry.OnUpdated(state);
  }

  OnEntryRemoved(state, entry)
  {
    return entry.OnRemoved(state);
  }

  OnEntryCreated(state, entry)
  {
    return entry.OnCreated(state);
  }

  TypeHandler(state, entry)
  {
    for (let i = 0; i < state.types.length; i++)
    {
      const type = state.types[i];
      switch (type)
      {
        case "created": return this.OnEntryCreated(state, entry);
        case "updated": return this.OnEntryUpdated(state, entry);
        case "removed": return this.OnEntryRemoved(state, entry);
        default: throw new Error(`Unknown file type of "${type}"`);
      }
    }
  }

  TypeHandler(state, entry)
  {
    switch (state.type)
    {
      case "created": return this.OnEntryCreated(state, entry);
      case "updated": return this.OnEntryUpdated(state, entry);
      case "removed": return this.OnEntryRemoved(state, entry);
      default: throw new Error(`Unknown file type of "${state.type}"`);
    }
  }

  async OnFileSystem(states)
  {
    // const loader  = this.GetLoader();
    // const domains = this.GetDomains();

    const loader = Loader.Get();
    // const loader = Getter();

    for (const state of states.values())
    {
      // const entry = await loader.Query(state.url.href, loader.GetDomains(), { validate: true });
      const entry = await loader.Query(state.url.href);

      if (entry)
      {
        await this.TypeHandler(state, entry);

        // // console.log("FSO update", entry.GetNormalized(), state.types);
        // loader.Update(entry);
        //
        // Get the list of entries that import this entry
        const references = await entry.GetReferences();

        // If no entries actually use this one, it's a dead end
        // If we reload with only it, then main won't be triggered
        if (references.size > 0)
        {
          // Tell the loader it can reload next time it's asked
          loader.SetReloadable(true);
        }
        // else
        // {
        //   await entry.Reload();
        // }
      }
    }
  }
}
