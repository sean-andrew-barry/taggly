import FS, {promises as FSP} from "fs";

import {Entry} from "./Entry.js";
import {Directory} from "./Directory.js";
import {File} from "./File.js";

export class Placeholder extends Entry
{
  async Validate()
  {
    let stats;
    try
    {
      stats = await FSP.stat(this);
    }
    catch (error)
    {
      // Already is a placeholder, so just return it
      return this;
    }

    if (stats.isFile())
    {
      // A file was created
      return File.From(this, stats);
    }
    else if (stats.isDirectory())
    {
      // A directory was created
      return Directory.From(this, stats);
    }
  }

  async Query(query, index, state)
  {
    const layer = this.GetLayer();

    // NOTE: What about HTTP for virtualization?
    if (!layer.IsTrusted() && this.pathname.includes(".js"))
    {
    }

    return undefined;
  }

  Search()
  {
    return undefined;
  }
}
