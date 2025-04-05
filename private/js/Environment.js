import cluster from "node:cluster";
import os from "node:os";
import {webcrypto as crypto} from "node:crypto";

import {Loader} from "/js/Loader.js";
// import {window} from "/js/Window.js";
// import {global} from "/js/Global.js";
import {IsLittleEndian} from "/js/External/IsLittleEndian.js";

import {Environment as Base} from "/js/Environment.js?after=/taggly/private/";

const loader = Loader.Get();

const IPS = Symbol("ips");

export class Environment extends Base
{
  static CreateCSRF()
  {
    const array = new Uint32Array(6);
    crypto.getRandomValues(array);

    let token = "";
    for (let i = 0; i < array.length; i++)
    {
      token += array[i].toString(16);
    }

    return token;
  }

  static GetDevelopment(){ return loader.GetDevelopment(); }
  static GetInstance(){ return loader.GetInstance(); }
  static GetVersion(){ return loader.GetVersion(); }
  static GetVersionMajor(){ return loader.GetVersionMajor(); }
  static GetVersionMinor(){ return loader.GetVersionMinor(); }
  static GetVersionPatch(){ return loader.GetVersionPatch(); }
  // static GetToken(){ return csrf ??= this.CreateCSRF(); }

  static GetData()
  {
    return {
      development: this.IsDevelopment(),
      instance: this.GetInstance(),
      version: this.GetVersion(),
      version_major: this.GetVersionMajor(),
      version_minor: this.GetVersionMinor(),
      version_patch: this.GetVersionPatch(),
      is_little_endian: IsLittleEndian(),
      // token: this.GetToken(),
    };
  }

  static CreateIPs()
  {
    const networks = os.networkInterfaces();

    const ips = [];
    const keys = Object.keys(networks);
    for (let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const interfaces = networks[key];

      for (let j = 0; j < interfaces.length; j++)
      {
        const value = interfaces[j];

        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        if (value.family !== "IPv4") continue;
        if (value.internal !== false) continue;

        ips.push(value.address);
      }
    }

    return ips;
  }

  static GetIPs(){ return this[IPS] ??= this.CreateIPs(); }

  static IsServer(){ return true; }
  static IsClient(){ return this.IsServer() !== true; }
  static IsPrimary(){ return cluster.isPrimary === true; }
  static IsWorker(){ return cluster.isWorker === true; }

  // static IsSandboxed()
  // {
  //   console.log("Calling IsSandboxed");
  //   return VirtualMachine.IsActive();
  // }

  static IsInlineFrame(){ return false; }
  // static GetLoader(){ return loader; }
  // static GetCached(name){ return this.GetLoader()?.GetCached(name); }
  // static SetCached(name, value){ return this.GetLoader()?.SetCached(name, value); }
  static GetCWD(){ return loader.GetCWD(); }
  static GetName(){ return loader.Read("name"); }

  static Reload(...args){ return loader.Reload(...args); }
  // static Search(...args){ return loader.Search(...args); }
  static GetLayers(...args){ return loader.GetLayers(...args); }
  // static GetRoot(...args){ return loader.Root(...args); }
  static GetDomains(){ return loader.GetDomains(); }
  static GetEntries(){ return loader.GetEntries(); }
  static GetConsoleColorsClass(){ return loader.GetConsoleColorsClass(); }

  // static _Reload(...args)
  // {
  //   const before_unload_event = new window.CustomEvent("beforeunload", { bubbles: false, cancelable: false });
  //   window.dispatchEvent(before_unload_event);

  //   const unload_event = new window.CustomEvent("unload", { bubbles: false, cancelable: false });
  //   window.dispatchEvent(unload_event);

  //   return this.GetLoader()?.Reload(...args);
  // }

  static async DepreciateFile(url, replacement)
  {
    const entry = await loader.Query(url, loader.GetDomains());

    const c = this.GetConsoleColorsClass();
    const normalized = entry.GetNormalized();
    const parts = [];
    parts.push(c.Warn("Warning:"));
    parts.push(`\n  The file at ${c.URL(normalized)} has been depreciated.`);

    if (replacement) parts.push(`\n  Use ${c.URL(replacement)} instead.`);

    const references = entry?.GetReferences();

    if (references)
    {
      parts.push(`\n\n  The following ${c.Number(references.size)} files import ${c.URL(normalized)}:\n`);

      const refs = [...references].sort((a, b) =>
      {
        const a_name = a.GetPathName();
        const b_name = b.GetPathName();
        return a_name.localeCompare(b_name);
      });

      for (let i = 0; i < refs.length; i++)
      {
        const ref = refs[i];

        parts.push("\n    ");
        if (10 > i) parts.push("");
        parts.push(c.Green(i) + ":", c.URL(ref.GetNormalized()));

        const name = await ref.GetLayer()?.GetName();
        if (name) parts.push("from layer", c.Cyan(name));
      }

      parts.push("\n");

      // let i = 0;
      // for (const ref of references)
      // {
      //   parts.push("\n    ");
      //   if (10 > i) parts.push("");
      //   parts.push(c.Green(i) + ":", c.URL(this.Normalize(ref.href)));
      //
      //   const name = await ref.GetLayer()?.GetName();
      //   if (name) parts.push("from layer", c.Cyan(name));
      //
      //   i += 1;
      // }
    }

    return console.warn(...parts);
  }

  static Normalize(url)
  {
    if (typeof(url) === "string")
    {
      url = new globalThis.URL(url);
    }

    url.search = "";

    const href = url.href;
    const domains = loader.GetDomains();
    for (let i = 0; i < domains.length; i++)
    {
      const domain = `/${domains[i]}/`;
      if (href.includes(domain))
      {
        const parts = href.split(domain);
        return "/" + parts[1];
      }
    }

    throw new Error(`Failed to normalize url "${url.href}"`);
  }

  static async GetLayerPackage(index = 0)
  {
    const layers = await loader.GetLayers();
    return await layers[index]?.GetPackage();
  }

  static OnBeforeUnload(event)
  {
  }

  static OnUnload(event)
  {
    // process.nextTick(() =>
    // {
    //   dom.window.close();
    // });
  }

  static OnFileUpdate(event)
  {
    if (this.IsDevelopment() === true)
    {
      loader.SetReloadable(true);
    }
  }

  static OnPrint(event)
  {
  }

  static OnCompilationDone(event)
  {
  }

  static OnCompilationError(event)
  {
    const c = this.GetConsoleColorsClass();

    const parts = [];
    parts.push(c.Error("\n[ENV] Compilation error:"));
    parts.push("\n\n   ", event.error);
    parts.push("\n");

    // parts.push(`\n    Continuing with ${c.URL(import.meta.url)}\n`);
    // parts.push(`\n    Continuing with instance ${c.Number(INSTANCE)}.\n`);

    // console.log("OnCompilationError", event.error);
    console.error(...parts);

    event.preventDefault(); // Tell the loader to not print the error, we handled it here
  }
}
