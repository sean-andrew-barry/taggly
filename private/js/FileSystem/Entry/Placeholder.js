import "/flag#dangerous";
// import "/flag#frozen";

import {promises as FSP} from "node:fs";

import {Entry} from "/js/FileSystem/Entry.js";
import {File} from "/js/FileSystem/Entry/File.js";
import {Directory} from "/js/FileSystem/Entry/Directory.js";

export class Placeholder extends Entry
{
  IsPlaceholder(){ return true; }

  Query(query, domains, state, index)
  {
    return undefined;
  }

  Rename(filepath){ throw new Error(`Cannot rename a placeholder`); }
  GetData(){ throw new Error(`Cannot access the data of a placeholder, because it has none`); }

  Access(flags){ return Promise.resolve(false); }
  AccessSync(flags){ return false; }

  async Refresh()
  {
    // console.log("Refreshing Placeholder", this.GetNormalized());

    const stats = await FSP.stat(this).catch(() => undefined);;

    // Still doesn't exist, so no change
    if (!stats) return this;

    const parent = this.GetParent();

    let replacement;
    if (stats.isFile())
    {
      replacement = new File(this, parent);
    }
    else if (stats.isDirectory())
    {
      replacement = new Directory(this, parent);
    }

    replacement.SetStats(stats);
    parent.ReplaceChild(this, replacement);

    this.destructor();
    return replacement;
  }
}
