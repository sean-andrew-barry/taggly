import FS, {promises as FSP} from "node:fs";
import {Query} from "/js/FileSystem/Query.js";
import {Directory} from "/js/FileSystem/Entry/Directory.js";
import {Layer} from "/js/FileSystem/Entry/Directory/Layer.js";
import {File} from "/js/FileSystem/Entry/File.js";
import {Placeholder} from "/js/FileSystem/Entry/Placeholder.js";
import {Block} from "/js/Memory/Block.js";

export class Graph
{
  constructor(data)
  {
    this.buffer = data.buffer;
    this.layers = [];
    this.domains = data?.domains.slice() ?? ["private", "public"];
    this.blocks = [];
    this.specifiers = new Map();

    for (let i = 0; i < data.layers.length; i++)
    {
      const layer = new Layer(data.layers[i]);
      this.layers.push(layer);
    }
  }

  async Query(query, parent)
  {
    if (!(query instanceof Query))
    {
      query = Query.Get(query);
    }

    const state = {
      parent,
      prev: undefined,
      domains: this.domains,
    };

    for (const layer of this.layers)
    {
      const entry = await layer.Query(query, state, 0);
      if (entry) return entry;
    }
  }

  async Resolve(specifier, context, next_resolve)
  {
    // The first thing to do is check if we have a block for this specifier
    // In order to do that, get the normalized specifier from a Query

    // this.Update();

    const parent = await this.Query(context.parentURL);
    const entry = await this.Query(specifier, parent);

    if (entry)
    {
      this.WriteModule(entry);
    }

    // for (const layer of this.layers)
    // {
    //   // const url = new URL(this.href + "/" + name);
    //   const entry = await layer.Query();
    // }

    // for (let i = 0; i < this.layers.length; i++)
    // {
    //   const layer = new Layer(this.layers[i]);
    //   this.layers.push(layer);
    // }

    // const url = new URL(this.href + "/" + name);
    // const stats = await FSP.stat(url, { throwIfNoEntry: false });
  }

  WriteModule(entry)
  {
    // this.WriteI32();
  }

  WriteImport(entry, parent)
  {

  }
}