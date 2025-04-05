import fs, {promises as fsp} from "fs";
import path from "path";
import NodePath from "path";
import {fileURLToPath, pathToFileURL} from "url";
import {Entry} from "./Entry.js";
import {File} from "./File.js";
import {Directory} from "./Directory.js";
import {Specifier} from "./Specifier.js";
import {Query} from "./Query.js";
import {Package} from "../Package.js";

const PACKAGE = Symbol("package");
const WATCHER = Symbol("watcher");
const TRUSTED = Symbol("trusted");
const VIRTUAL = Symbol("virtual");

export class Layer extends Directory
{
  // constructor(...args)
  // {
  //   super(...args);
  // }

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

  GetPackage(){ return this[PACKAGE] ??= this.CreatePackage(); }
  GetWatcher(){ return this[WATCHER]; }

  SetPackage(pkg){ return this[PACKAGE] = pkg; }
  SetWatcher(watcher){ return this[WATCHER] = watcher; }

  CreatePackage(data)
  {
    if (!data)
    {
      const file = new File(`${this.href}/package.json`, this);
      if (file.IsRealSync())
      {
        data = file.ReadSync();
      }
    }

    return new Package(data);
  }

  CreateTrusted()
  {
    const domains = this.GetDomains();
    return domains.includes("protected");
  }

  CreateVirtual()
  {
    return this.GetPackage()?.virtual === true;
  }

  GetDomains(){ return this.GetPackage()?.GetDomains(); }
  IsVirtual(){ return this.GetPackage()?.virtual === true; }
  IsVirtual(){ return this[VIRTUAL] ??= this.CreateVirtual(); }
  IsTrusted(){ return this[TRUSTED] ??= this.CreateTrusted(); }

  // async GetName(){ return (await this.GetPackage())?.name; }

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

  async Query(query, domains, state = {})
  {
    if (typeof(query) === "string")
    {
      query = new Query(query);
    }

    for (let i = 0; i < domains.length; i++)
    {
      const domain = await this.FindChild(domains[i]);
      if (!domain) continue;

      domain.SetDomain(domain);

      // Make any absolute query relative to each domain
      let relative_query = query;
      if (query.IsAbsolute())
      {
        if (query.specifier === domain.href)
        {
          return domain;
        }

        relative_query = query.From(domain);
      }

      const result = await domain.Query(relative_query, 0, state);
      if (result) return result;
    }
  }

  QuerySync(query, domains, state = {})
  {
    if (typeof(query) === "string")
    {
      query = new Query(query);
    }

    for (let i = 0; i < domains.length; i++)
    {
      const domain = this.FindChildSync(domains[i]);
      if (!domain) continue;

      domain.SetDomain(domain);

      // Make any absolute query relative to each domain
      let relative_query = query;
      if (query.IsAbsolute())
      {
        relative_query = query.From(domain);
      }

      const result = domain.QuerySync(relative_query, 0, state);
      if (result) return result;
    }
  }

  async Search(importer, parameters, domains, specifier, validate = false)
  {
    const original = specifier;

    // If it's absolute and does not include this layer, it cannot match
    if (specifier.startsWith("file:///") === true)
    {
      if (!specifier.includes(this.href))
      {
        return;
      }
      else
      {
        const dif = this.Compare(specifier);
        if (typeof(dif) === "string")
        {
          specifier = dif;
        }
      }
    }

    const parts = specifier.replace(/^\/|\/$/g, "").split("/");

    for (let i = 0; i < domains.length; i++)
    {
      // If the first part is a domain, like "public" or "private"
      if (parts[0] === domains[i])
      {
        const part = parts.shift();
        domains = [part]; // Overwrite the domains so now it is restricted to the part
        break;
      }
    }

    for (let i = 0; i < domains.length; i++)
    {
      const domain = domains[i];

      const child = await this.FindChild(domain);
      if (!child) continue;

      const result = await child.Search(importer, parameters, domains, specifier, validate, parts, 0);
      if (result)
      {
        return result;
      }
    }
  }
}
