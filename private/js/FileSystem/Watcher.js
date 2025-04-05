import "/flag#dangerous";

import FS from "node:fs";
import {pathToFileURL} from "node:url";
import Path from "node:path";

import {Getter} from "/js/Loader/Getter.js";

export class Watcher
{
  #directory;
  #watcher;

  constructor(directory)
  {
    const queue = [];

    this.#directory = directory;
    this.#watcher = FS.watch(directory, this.GetWatcherOptions(), async (event, specifier) =>
    {
      while (queue.length > 0)
      {
        await queue.shift();
      }

      queue.push(this.OnChange(event, specifier));
    });
  }

  destructor(...args)
  {
    this.#directory = undefined;
    this.#watcher.close();
    this.#watcher = undefined;
  }

  IsPersistent(){ return false; }
  IsRecursive(){ return true; }

  GetWatcherOptions()
  {
    return {
      persistent: this.IsPersistent(),
      recursive: this.IsRecursive(),
    };
  }

  async OnChange(event, specifier)
  {
    if (!specifier) return;

    const loader = Getter();

    // Wait until the loader is done resolving,
    // otherwise a file getting refreshed may cause there
    // to be two different versions of it in the same load
    await loader.GetLoading();

    const path = Path.resolve(this.#directory.GetPath(), specifier);
    const url = pathToFileURL(path);

    const entry = loader.Query(url);

    if (entry)
    {
      // Get the list of entries that import this entry
      const references = await entry.GetReferences();

      await entry.Refresh();

      // If no entries actually use this one, it's a dead end
      // If we reload with only it, then main won't be triggered
      if (references.size > 0)
      {
        // Tell the loader it can reload next time it's asked
        loader.SetReloadable(true);
      }
    }
  }
}