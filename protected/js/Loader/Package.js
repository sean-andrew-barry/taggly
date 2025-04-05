import "/flag#dangerous";

import {URL, pathToFileURL, fileURLToPath} from "url";
import Path from "path";
import FS from "fs";

export class Package
{
  // constructor(json = "{}", url)
  // {
  //   const data = JSON.parse(json);
  //
  //   // for (const key in data)
  //   // {
  //   //   if (!data.hasOwnProperty(key)) continue;
  //   //   this[key] = data[key];
  //   // }
  //
  //   const keys = Object.keys(data);
  //   for (let i = 0; i < keys.length; i++)
  //   {
  //     const key = keys[i];
  //     const val = data[key];
  //
  //     this[key] = val;
  //   }
  // }

  constructor(data = {}, url)
  {
    if (typeof(data) === "string")
    {
      data = JSON.parse(data);
    }

    // for (const key in data)
    // {
    //   if (!data.hasOwnProperty(key)) continue;
    //   this[key] = data[key];
    // }

    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = data[key];

      this[key] = val;
    }
  }

  Initialize(url, encoding = "utf-8")
  {
    try
    {
      FS.accessSync(url, FS.constants.F_OK);
    }
    catch (error)
    {
      throw new Error(`Cannot create a package at "${url}" because it does not exist.`);
    }

    let text;
    try
    {
      text = FS.readFileSync(url, encoding);
    }
    catch (error)
    {
      throw new Error(`Cannot create a package at "${url}" because it does cannot be read.`);
    }

    const data = JSON.parse(text);
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const val = data[key];

      this[key] = val;
    }

    this.version ??= "0.0.0";

    this.domains ??= [
      "private",
      "public",
    ];

    this.cwd ??= global.process.cwd();
    this.instance ??= 0;
    this.cluster_size ??= 1;
    this.layers ??= [];
    this.window_url ??= "https://localhost:3000/";
    this.start ??= "/js/Start.js";
    this.flags ??= ["--experimental-loader"];

    // Make each layer path into an absolute file URL
    for (let i = 0; i < this.layers.length; i++)
    {
      const layer = this.layers[i];

      // If it's already absolute, skip it
      if (layer.startsWith("file:///")) continue;

      const path = Path.resolve(layer);

      try
      {
        const stat = FS.statSync(layer);
      }
      catch (error)
      {
        throw new Error(`Failed to load layer ${i} at "${layer}"`);
      }

      this.layers[i] = pathToFileURL(path).href;
    }
  }

  Select(key, current = this)
  {
    const parts = key.split(".");
    const last = parts.pop();

    for (let i = 0; i < parts.length; i++)
    {
      let part = parts[i];

      if (current instanceof Array)
      {
        part = Number(part);
      }

      if (current.hasOwnProperty(part)) current = current[part];
      else throw new Error(`Cannot select invalid key "${part}" from string "${key}"`);
    }

    return {
      selection: current,
      last,
    };
  }

  Read(key)
  {
    const {selection, last} = this.Select(key);
    return selection[last];
  }

  Write(key, value)
  {
    const {selection, last} = this.Select(key);
    selection[last] = value;

    return this;
  }

  Assign(key, value)
  {
    const {selection, last} = this.Select(key);

    if (!selection.hasOwnProperty(last))
    {
      selection[last] = value;
    }

    return this;
  }

  Push(key, value, unique = true)
  {
    const {selection, last} = this.Select(key);

    const array = selection[last];
    if (!array)
    {
      selection[last] = [value];
    }
    else if (unique === true)
    {
      if (!array.includes(value))
      {
        array.push(value);
      }
    }
    else
    {
      array.push(value);
    }

    return this;
  }

  Delete(key)
  {
    const {current, last} = this.Select(key);

    const value = selection[last];
    delete selection[last];

    return value;
  }

  Get(key){ return this[key]; }
  Has(key){ return this.hasOwnProperty(key); }

  ResolveDomains()
  {
    const domains = this.domains || (this.domains = {});

    for (const key in domains)
    {
      if (!domains.hasOwnProperty(key)) continue;

      const urls = domains[key];

      for (let i = 0; i < urls.length; i++)
      {
        urls[i] = pathToFileURL(Path.resolve(this.GetCWD(), urls[i]));
      }
    }
  }

  ResolveDomains()
  {
    const domains = this.domains || (this.domains = {});

    for (const key in domains)
    {
      if (!domains.hasOwnProperty(key)) continue;

      const urls = domains[key];

      for (let i = 0; i < urls.length; i++)
      {
        urls[i] = pathToFileURL(Path.resolve(this.GetCWD(), urls[i]));
      }
    }
  }

  SetCWD(v){ return this.Assign("cwd", v); }
  SetFrameworkCWD(v){ return this.Assign("framework_cwd", v); }
  SetMainPath(v){ return this.Assign("main_path", v); }
  SetStartURL(v){ return this.Assign("start_url", v); }
  SetAppURL(v){ return this.Assign("app_url", v); }
  SetAppParentURL(v){ return this.Assign("app_parent_url", v); }
  SetFrameworkURL(v){ return this.Assign("framework_url", v); }
  SetPackagePath(v){ return this.Assign("package_path", v); }
  SetLoaderPath(v){ return this.Assign("loader_path", v); }
  SetWindowURL(v){ return this.Assign("window_url", v); }
  SetFlags(v){ return this.Assign("flags", v); }
  SetClusterSize(v){ return this.Assign("cluster_size", v); }
  AddFlag(v){ return this.Push("flags", v, true); }
  SetDomain(d, v){ return this.Assign(`domains.${d}`, v); }

  GetCWD(){ return this.cwd; }
  GetFrameworkCWD(){ return this.framework_cwd; }
  GetMainPath(){ return this.main_path; }
  GetStartURL(){ return this.start_url; }
  GetAppURL(){ return this.app_url; }
  GetAppParentURL(){ return this.app_parent_url; }
  GetFrameworkURL(){ return this.framework_url; }
  GetPackagePath(){ return this.package_path; }
  GetLoaderPath(){ return this.loader_path; }
  GetWindowURL(){ return this.window_url; }
  GetFlags(){ return this.flags; }
  GetClusterSize(){ return this.cluster_size ??= 1; }
  GetDomains(){ return this.domains ??= ["private", "public"]; }
  GetDomain(name){ return this.GetDomains()[name]; }
  HasDomain(name){ return this.GetDomains().hasOwnProperty(name); }
  GetCMD(){ return `node ${this.flags.join(" ")} ${this.loader_path} "${this.main_path}"`; }

  GetVersion()
  {
    return this?.npm_config?.version
        ?? this.version
        ?? "1.0.0";
  }

  GetDevelopment()
  {
    return this?.npm_config?.development
        ?? this.version
        ?? false;
  }
}
