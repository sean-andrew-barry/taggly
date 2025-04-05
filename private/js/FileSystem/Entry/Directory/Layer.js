import "/flag#dangerous";

import {Directory} from "/js/FileSystem/Entry/Directory.js";
import {Domain} from "/js/FileSystem/Entry/Directory/Domain.js";
import {Query} from "/js/Loader/Query.js";
import {Package} from "/js/Loader/Package.js";
import {Watcher} from "/js/FileSystem/Watcher.js";

const VIRTUAL = Symbol("virtual");

export class Layer extends Directory
{
  constructor(source)
  {
    super(source);

    this.GetWatcher();

    if (source.IsLayer?.())
    {
      if (source.HasPackage()) this.#package = source.GetPackage();
      // if (source.HasWatcher()) this.#watcher = source.GetWatcher();
    }
  }

  destructor()
  {
    this.#watcher.destructor();

    return super.destructor();
  }

  #package;
  async CreatePackage()
  {
    let data;

    if (!data)
    {
      const file = await this.GetChild("package.json");
      const buffer = await file.GetData();

      data = new TextDecoder().decode(buffer);

      // const file = new File(`${this.href}/package.json`, this);
      // if (file.IsRealSync())
      // {
      //   data = file.ReadSync();
      // }
    }

    return new Package(data);
  }

  HasPackage(){ return this.#package !== undefined; }
  GetPackage(){ return this.#package ??= this.CreatePackage(); }

  #watcher;
  CreateWatcher()
  {
    return new Watcher(this);
  }

  HasWatcher(){ return this.#watcher !== undefined; }
  GetWatcher(){ return this.#watcher ??= this.CreateWatcher(); }

  GetLayer(){ return this; }
  GetParent(){ throw new Error(`Cannot call GetParent on a Layer, because Layers have no parent entry`); }
  GetDomain(){ throw new Error(`Cannot call GetDomain on a Layer, because Layers aren't in a domain`); }

  IsLayer(){ return true; }

  Initialize(domains)
  {
    for (let i = 0; i < domains.length; i++)
    {
      this.FindChild(domains[i]).then(child =>
      {
        if (child) child.Initialize();
      });
    }
  }

  CreateVirtual()
  {
    return this.GetPackage()?.virtual === true;
  }

  // GetDomains(){ return this.GetPackage().then(pkg => pkg.GetDomains()); }
  GetDomains(){ return this.GetLayer().GetDomains(); }
  IsVirtual(){ return this.GetPackage()?.virtual === true; }
  IsVirtual(){ return this[VIRTUAL] ??= this.CreateVirtual(); }

  // Find where the specifier differs from this layer's href
  Compare(specifier)
  {
    const href = this.href;
    const length = Math.max(specifier.length, href.length);

    for (let i = 0; i < length; i++)
    {
      if (href[i] !== specifier[i])
      {
        return specifier.substring(i);
      }
    }
  }

  Includes(query, domains)
  {
    if (!query.IsAbsolute()) throw new Error(`Layer.Includes only works on absolute queries`);

    const parts = this.GetParts();
    const query_parts = query.GetParts();

    for (let i = 0; i < parts.length; i++)
    {
      if (parts[i].toLowerCase() !== query_parts[i].toLowerCase())
      {
        return false;
      }
    }

    // console.log("All parts matched... Checking domains", query_parts[parts.length]);

    return domains.includes(query_parts[parts.length].toLowerCase());
  }

  Resolve(query, domains, state, index = 0)
  {

  }

  Query(query, domains, state = {}, index = 0)
  {
    if (typeof(query) === "string")
    {
      query = new Query(query);
    }

    if (query.IsAbsolute())
    {
      const parts = this.GetParts();
      const query_parts = query.GetParts();

      for (let i = 0; i < parts.length; i++)
      {
        const a = parts[i].toLowerCase();
        const b = query_parts[i].toLowerCase();

        if (a !== b)
        {
          return;
        }
        else
        {
          index = i;
        }
      }

      index += 1;
      const domain_part = query_parts[index].toLowerCase();

      for (let i = 0; i < domains.length; i++)
      {
        const domain_name = domains[i];
        if (domain_name.toLowerCase() === domain_part)
        {
          const domain = this.FindChild(domain_name, Domain);
          if (!domain) throw new Error(`The absolute path "${query.original}" is invalid because the domain "${domain_name}" does not exist`);

          return domain.Query(query, domains, state, index + 1);
        }
      }
    }
    else
    {
      for (let i = 0; i < domains.length; i++)
      {
        const domain = this.FindChild(domains[i], Domain);
        if (!domain) continue;

        const result = domain.Query(query, domains, state, 0);
        if (result) return result;
      }
    }
  }
}
