import "/flag#dangerous";

import "/js/FileSystem/Entries.js";

// import { threadId } from "node:worker_threads";

import {Query} from "/js/Loader/Query.js";
import {Directory} from "/js/FileSystem/Entry/Directory.js";
import {Layer} from "/js/FileSystem/Entry/Directory/Layer.js";
import {File} from "/js/FileSystem/Entry/File.js";
import {Placeholder} from "/js/FileSystem/Entry/Placeholder.js";
import {ErrorParser} from "/js/External/ErrorParser.js";
import {ConsoleColors, ConsoleColors as C} from "/js/Utility/ConsoleColors.js";
import {Buffer as TagglyBuffer} from "/js/Utility/Buffer.js";
import {Data as DATA} from "/js/Loader/Data.js";
import {StringBuilder} from "/js/Utility/StringBuilder.js";

const NULL_URL = new URL("../Loader/Null.js", import.meta.url).href;
const ERROR_URL = new URL("../Loader/Error.js", import.meta.url).href;
const RESOLVED_URL = new URL("../Loader/Resolved.js", import.meta.url).href;
const REGISTER_URL = new URL("../Loader/Register.js", import.meta.url).href;

const SELF = new URL(import.meta.url);
const SELF_URL = SELF.href;

const ENCODING = "utf8";
// TODO: What about using Template instead of Fragment for HTML imports?
const HTML_BUFFER = Buffer.from(`import {Fragment} from "/js/Tags/Fragment.js";\n\nexport default new Fragment().InnerHTML("`, ENCODING);
const CSS_BUFFER = Buffer.from(`import {Style} from "/js/Tags/Style.js";\n\nexport default new Style().Text("`, ENCODING);
const JSON_BUFFER = Buffer.from(`export default `, ENCODING);
const DEFAULT_BUFFER = Buffer.from(`export default "`, ENCODING);
const END_BUFFER = Buffer.from(`");`, ENCODING);
// const RESOLVED_FLAG = Buffer.from(`\nimport "/flag#resolved";`, ENCODING);
const RESOLVED_FLAG = Buffer.from(`\nimport {Resolver as __LoaderAutoResolver} from "/flag#resolved";\n__LoaderAutoResolver(import.meta);`, ENCODING);

// console.log("Evaluated Loader.js", import.meta.url, threadId);

let instance;
export class Loader
{
  static Get(){ return instance ??= new this(); }

  #name;
  #version;
  #version_major;
  #version_minor;
  #version_patch;
  #description;
  #main;
  #port;
  #cluster_size;
  #cluster_delay;
  #development;
  #flags = [];
  #domains = [];
  #author;
  #license;
  #dependencies = {};
  #npm_config = {};
  #instance;
  #imported;
  #cwd;
  #framework_cwd;
  #main_path;
  #app_url;
  #app_parent_url;
  #start_url;
  #package_path;
  #loader_path;
  #window_url;
  #content_type;
  #storage_quota;
  #layers = [];
  #reloadable = false;
  #loading;
  #reload_promise;
  #parent_map = new Map();
  // #data_map = new Map();
  #query_cache = new WeakMap();
  #overrides = new WeakMap();
  #unresolved = new Set();
  #formatted_data = new WeakMap();
  #loaded = new Set();
  #stack = [];
  #preloader_url;
  #default_resolver;
  #start;
  #loader;
  #lines = 0;
  #files = 0;
  #requests = 0;
  #prev_parent_url;
  #last_entry_resolved;
  #last_entry_loaded;

  CreateLayer(index, url)
  {
    const layer = new Layer(url);

    layer.SetTrusted(true);

    // if (url.endsWith("/elember"))
    // {
    //   console.log("Not trusting elember layer");
    //   layer.SetTrusted(false);
    // }

    // layer.SetParent(undefined);
    // layer.SetLoader(this);
    // layer.SetLayer(layer);
    // layer.SetLayerIndex(index);
    // layer.SetInstance(this.GetInstance());
    // layer.SetImported(this.GetImported());
    // layer.SetDevelopment(this.GetDevelopment());

    // layer.GetWatcher(); // Create the watcher

    return layer;
  }

  GetLoading(){ return this.#loading; }
  GetStart(){ return this.#start; }
  GetWindowURL(){ return this.#window_url ?? "https://localhost/"; }
  GetContentType(){ return this.#content_type ?? "text/html"; }
  GetStorageQuota(){ return this.#storage_quota; }
  GetDevelopment(){ return this.#development; }
  GetInstance(){ return this.#instance; }
  GetImported(){ return this.#imported; }
  GetVersion(){ return this.#version; }
  GetVersionMajor(){ return this.#version_major; }
  GetVersionMinor(){ return this.#version_minor; }
  GetVersionPatch(){ return this.#version_patch; }
  GetDomains(){ return this.#domains; }
  GetLoaderPath(){ return this.#loader_path; }
  GetPreloaderURL(){ return this.#preloader_url; }
  GetDefaultResolver(){ return this.#default_resolver; }
  UseResolvedFlag(){ return true; }
  // UseResolvedFlag(){ return false; }
  CountFlagRequests(){ return false; }

  GetReloadable(){ return this.#reloadable; }
  SetReloadable(reloadable){ this.#reloadable = reloadable; }

  GetReloadPromise(){ return this.#reload_promise; }
  SetReloadPromise(reload_promise){ this.#reload_promise = reload_promise; }

  GetParentMap(){ return this.#parent_map; }
  GetQueryCache(){ return this.#query_cache; } // TODO
  GetLayers(){ return this.#layers; }
  // IsWrapping(){ return true; }
  IsWrapping(){ return false; }
  IsContextifying(){ return true; }
  // IsContextifying(){ return false; }
  IsDevelopment(){ return this.#development === true; }
  GetTrusted(){ return true; }

  constructor(data = DATA)
  {
    // // console.log("CONSTRUCTING LOADER");
    // const old_loader = data.loader;
    // data.loader = this;

    // this.#name = data.name;
    // this.#description = data.description;
    // this.#port = data.port;
    // this.#cluster_size = data.cluster_size;
    // this.#cluster_delay = data.cluster_delay;
    // this.#author = data.author;
    // this.#license = data.license;
    // this.#window_url = data.window_url;
    // this.#loader_path = data.loader_path;

    // this.#version = data?.npm_config?.version ?? data.version ?? "1.0.0";

    // const parts = this.#version.split(".").map(p =>
    // {
    //   const n = Number(p);

    //   if (Number.isNaN(n)) return 0;
    //   else return n;
    // });

    // this.#version_major = parts[0];
    // this.#version_minor = parts[1];
    // this.#version_patch = parts[2];

    // this.#development = data?.npm_config?.development ?? data?.development ?? false;
    // this.#instance = data.instance ?? 0;
    // this.#imported = data.imported ?? new Date();

    // if (data.flags) this.#flags.push(...data.flags);
    // if (data.domains) this.#domains.push(...data.domains);

    // if (this.#development && !this.#domains.includes("development"))
    // {
    //   // console.log("Adding development domain");
    //   this.#domains.unshift("development");
    //   // console.log(this.#domains);
    // }

    // if (data.preloader_url) this.#preloader_url = data.preloader_url;

    // if (old_loader)
    // {
    //   for (const layer of old_loader.GetLayers())
    //   {
    //     // console.log("Cloning layer", layer.GetNormalized());
    //     this.#layers.push(new Layer(layer, this));

    //     layer.destructor();
    //   }
    // }
    // else if (data.layers)
    // {
    //   for (let i = 0; i < data.layers.length; i++)
    //   {
    //     let layer = data.layers[i];

    //     if (typeof(layer) === "string")
    //     {
    //       layer = this.CreateLayer(i, layer);
    //     }

    //     this.#layers.push(layer);
    //   }

    //   if (data.preloads)
    //   {
    //     const preloads = data.preloads;
        
    //     // Reset these, since the layers are shared between loaders
    //     data.preloads = new Map();
  
    //     this.Preloads(preloads);
    //   }
    // }

    // this.Destructor(SELF_URL, () =>
    // {
    //   console.log("~~~~~~Destructing loader~~~~~~~~");
    // });

    // this.Start();
  }

  Initialize(data)
  {
    // console.log("CONSTRUCTING LOADER");
    const old_loader = data.loader;
    data.loader = this;

    this.data = data;
    this.#name = data.name;
    this.#description = data.description;
    this.#port = data.port;
    this.#cluster_size = data.cluster_size;
    this.#cluster_delay = data.cluster_delay;
    this.#author = data.author;
    this.#license = data.license;
    this.#window_url = data.window_url;
    this.#loader_path = data.loader_path;

    this.#version = data?.npm_config?.version ?? data.version ?? "1.0.0";

    const parts = this.#version.split(".").map(p =>
    {
      const n = Number(p);

      if (Number.isNaN(n)) return 0;
      else return n;
    });

    this.#version_major = parts[0];
    this.#version_minor = parts[1];
    this.#version_patch = parts[2];

    this.#development = data?.npm_config?.development ?? data?.development ?? false;
    this.#instance = data.instance ?? 0;
    this.#imported = data.imported ?? new Date();

    if (data.flags) this.#flags.push(...data.flags);
    if (data.domains) this.#domains.push(...data.domains);

    if (this.#development && !this.#domains.includes("development"))
    {
      // console.log("Adding development domain");
      this.#domains.unshift("development");
      // console.log(this.#domains);
    }

    if (data.preloader_url) this.#preloader_url = data.preloader_url;

    if (old_loader)
    {
      for (const layer of old_loader.GetLayers())
      {
        // console.log("Cloning layer", layer.GetNormalized());
        this.#layers.push(new Layer(layer, this));

        layer.destructor();
      }
    }
    else if (data.layers)
    {
      for (let i = 0; i < data.layers.length; i++)
      {
        let layer = data.layers[i];

        if (typeof(layer) === "string")
        {
          layer = this.CreateLayer(i, layer);
        }

        this.#layers.push(layer);
      }

      if (data.preloads)
      {
        const preloads = data.preloads;
        
        // Reset these, since the layers are shared between loaders
        data.preloads = new Map();
  
        this.Preloads(preloads);
      }
    }

    // this.Destructor(SELF_URL, () =>
    // {
    //   console.log("~~~~~~Destructing loader~~~~~~~~");
    // });

    // this.Start();
  }

  Preloads(preloads)
  {
    const domains = this.GetDomains();

    for (const [url, {parent_url, imports, references, flags}] of preloads)
    {
      let parent;
      if (parent_url)
      {
        parent = this.Query(parent_url, domains, { trusted: true });
      }

      const entry = this.Query(url, domains, { parent, trusted: true });

      if (!entry)
      {
        throw new Error(`Failed to preload an entry for "${url}`);
      }

      for (const flag of flags)
      {
        entry.Flag(flag);
      }

      for (const url of imports)
      {
        entry.AddImport(this.Query(url, domains, { parent: entry, trusted: true }));
      }

      for (const url of references)
      {
        entry.AddReference(this.Query(url, domains, { parent: entry, trusted: true }));
      }

      // Loads and caches the data
      entry.GetETag();
    }
  }

  Send(...args)
  {
    // console.log("Not sending", args);
    // console.warn("Implement Loader.Send", args.at(0));
  }

  async Start()
  {
    await this.#loading;

    return this.#loading = new Promise(async (resolve, reject) =>
    {
      const time = performance.now();

      this.#lines = 0;
      this.#files = 0;
      this.#requests = 0;
      this.#loaded.clear();
  
      this.#loader = this.Query(SELF_URL);
      this.#start = this.Query("/js/Start.js");

      await this.Import("/js/Start.js")
      .then(async mod =>
      {
        const stop = performance.now() - time;
  
        const loaded = [...this.#loaded].sort((a, b) =>
        {
          return a.GetBytes() - b.GetBytes();
        });
  
        let lines = 0;
        let bytes = 0;
        for (let i = 0; i < loaded.length; i++)
        {
          const entry = loaded[i];
          // console.log(i, entry.GetNormalized(), entry.GetBytes(), entry.GetLines());
          lines += entry.GetLines();
          bytes += entry.GetBytes();
        }
  
        console.log(`Resolved ${C.Number(this.#requests)} imports and loaded ${C.Number(lines)} lines (${C.Number(bytes / (1_000_000))}mb) from ${C.Number(loaded.length)} files after ${C.Number(stop)} ms`);
  
        if (!Object.hasOwn(mod, "Main") || typeof(mod.Main) !== "function")
        {
          throw new Error(`Expected the file "${this.#start.GetNormalized()}" to export a function called "Main"`);
        }
  
        // Invoke the Main function and save its return
        this.#main = await mod.Main();

        return resolve(this.#main);
      })
      .catch(cause =>
      {
        if (this.#start)
        {
          const stop = performance.now() - time;
          const url = this.#start.GetNormalized();
          const error = new Error(`Importing ${C.URL(url)} failed after ${C.Number(stop)} ms, last file resolved was ${C.URL(this.#last_entry_resolved?.GetNormalized())}`, { cause });
  
          return reject(error);
        }
        else
        {
          return reject(cause);
        }
      });
    });
  }

  LogLoaded()
  {
    const f = new Intl.NumberFormat();

    const path  = this.Normalize(this.#start);
    const time  = f.format(Math.round(this.stop - this.start));
    const chars = f.format(this.GetChars());
    const lines = f.format(this.GetLines());
    const mb    = f.format(this.GetHeapUsed());
    const files = f.format(this.files);

    const {
      code_and_metadata_size,
      bytecode_and_metadata_size,
      external_script_source_size,
    } = v8.getHeapCodeStatistics();

    const code = f.format(code_and_metadata_size / (1024 * 1024)) + " mb";
    const bytecode = f.format(bytecode_and_metadata_size / (1024 * 1024)) + " mb";
    const external = f.format(external_script_source_size / (1024 * 1024)) + " mb";

    const heaps = v8.getHeapSpaceStatistics();

    const {
      total_heap_size,
      total_heap_size_executable,
      total_physical_size,
      total_available_size,
      used_heap_size,
      heap_size_limit,
      malloced_memory,
      peak_malloced_memory,
      does_zap_garbage,
      number_of_native_contexts,
      number_of_detached_contexts,
    } = v8.getHeapStatistics();

    // console.log(heaps);
    // console.log(v8.getHeapStatistics());

    // console.log(`\nCode size: ${Green(code)}, bytecode size: ${Green(bytecode)}, external code size: ${Green(external)}`);

    let in_development = "";
    if (this.development === true)
    {
      in_development = ` in development mode`;
    }

    if (this.GetLines() === 0)
    {
      console.log(`\nRoot ${Underline(Cyan(path))} imported ${Green(files)} files after ${Green(time)} ms using ${Green(mb)} mb${in_development}\n`);
    }
    else
    {
      console.log(`\nRoot ${Underline(Cyan(path))} imported ${Green(lines)} lines of code from ${Green(files)} files after ${Green(time)} ms using ${Green(mb)} mb${in_development}\n`);

      for (const layer of this.layers)
      {
        const name = layer.GetName();
        const lines = f.format(layer.GetLines());
        const chars = f.format(layer.GetChars());

        console.log(`Layer ${Underline(Cyan(name))} has ${Green(lines)} lines and ${Green(chars)} characters.`);
      }
    }

    console.log();
  }

  GetPackage(){ return this.#layers.at(0)?.GetPackage(); }

  IsStackTrusted(remove = this.IsStackTrusted)
  {
    const error = {};
    Error.captureStackTrace(error, remove);
    const stack = ErrorParser(error);

    const preloader_url = this.GetPreloaderURL();
    const layers = this.GetLayers();
    const domains = this.GetDomains();

    for (let i = 0; i < stack.length; i++)
    {
      const {name, file} = stack[i];

      if (file.startsWith("node:internal/")) continue; // Node files are trusted
      if (file === SELF_URL) continue; // This Loader.js file is always trusted
      if (file === preloader_url) continue; // The Preloader.js file is always trusted

      const query = new Query(file);

      // Make sure that every other file in the stack is included in one of the layers
      let included = false;
      for (let j = 0; j < layers.length; j++)
      {
        if (layers[j].Includes(query, domains))
        {
          included = true;
          break;
        }
      }

      if (!included) return false;
    }

    return true;
  }

  async IsTrusted(remove = this.IsTrusted)
  {
    const error = {};
    Error.captureStackTrace(error, remove);

    const stack = ErrorParser(error);

    const layers = this.GetLayers();
    const layer = layers[layers.length - 1];

    const domains = this.GetDomains();

    let trusted = true;
    for (let i = 0; i < stack.length; i++)
    {
      const {name, file} = stack[i];
      const entry = await layer.Query(file, domains);

      if (!entry)
      {
        trusted = false;
      }
    }

    return trusted;
  }

  Trace(remove = this.Trace)
  {
    const error = {};
    Error.captureStackTrace(error, remove);

    return ErrorParser(error);
  }

  TraceEntry(remove = this.TraceEntry)
  {
    const stack = this.Trace(remove);
    const last = stack[0];

    return this.Query(last.file);
  }

  async IsTrustedStack()
  {
    try
    {
      throw new Error();
    }
    catch (error)
    {
      // const {default: ErrorParser} = await import("/js/External/ErrorParser.js");

      const stack = ErrorParser(error);
      stack.shift(); // Get rid of the Loader.IsTrustedStack call

      const layers = this.GetLayers();
      const layer = layers[layers.length - 1];
      const domains = this.GetDomains();

      let trusted = true;
      for (let i = 0; i < stack.length; i++)
      {
        const {name, file} = stack[i];
        const entry = await layer.Query(file, domains);

        if (!entry)
        {
          trusted = false;
        }
      }

      return trusted;
    }
  }

  // TODO: Depreciate
  Normalize(url)
  {
    if (typeof(url) === "string")
    {
      url = new URL(url);
    }

    const href = url.href;
    const domains = this.GetDomains();
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

  GetConsoleColorsClass(){ return ConsoleColors; }

  async DepreciateFile(url, replacement)
  {
    return this.Depreciate(url, replacement);
  }

  GetOverrides(){ return this.#overrides; }
  // GetEntries(){ return Entries; }
  GetFileConstructor(){ return File; }
  GetDirectoryConstructor(){ return Directory; }
  GetLayerConstructor(){ return Layer; }
  GetPlaceholderConstructor(){ return Placeholder; }

  Destructor(specifier, destructor)
  {
    if (typeof(specifier) !== "string") throw new Error(`The specifier parameter must be a string`);
    if (typeof(destructor) !== "function") throw new Error(`The destructor parameter must be a function`);

    const entry = this.Query(specifier);
    if (!entry) throw new Error(`Cannot schedule destructor, because no entry was found for specifier "${specifier}"`);

    return entry.AddDestructor(destructor);
  }

  async Constructor(specifier, ctor)
  {
    if (typeof(specifier) !== "string") throw new Error(`The specifier parameter must be a string`);
    if (typeof(ctor) !== "function") throw new Error(`The constructor parameter must be a function`);

    const entry = this.Query(specifier);
    if (!entry) throw new Error(`Cannot schedule constructor, because no entry was found for specifier "${specifier}"`);

    await entry.Await();

    try
    {
      ctor(entry);
    }
    catch (error)
    {
      console.error(error);
    }

    // return entry.AddConstructor(ctor);
  }

  Depreciate(specifier, replacement)
  {
    if (typeof(specifier) !== "string") throw new Error(`The specifier parameter must be a string`);

    const entry = this.Query(specifier);

    const parts = [];
    parts.push(C.Warn("Warning:"));
    parts.push(`\n  The file at ${C.URL(entry.GetNormalized())} has been depreciated.`);

    if (replacement) parts.push(`\n  Use ${C.URL(replacement)} instead.`);

    const references = entry?.GetReferences();
    if (references)
    {
      parts.push(`\n\n  The following ${C.Number(references.size)} files import ${C.URL(entry.GetNormalized())}:\n`);

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
        parts.push(C.Green(i) + ":", C.URL(ref.GetNormalized()));

        const name = ref.GetLayerName();
        if (name) parts.push("from layer", C.Cyan(name));
      }

      parts.push("\n");
    }

    return console.warn(...parts);
  }

  Query(query, domains = this.GetDomains(), state = {})
  {
    if (typeof(domains) !== "object") throw new Error(`Expected domains to be an object`);
    if (!(domains instanceof Array)) throw new Error(`Expected domains to be an array`);

    if (typeof(query) === "string")
    {
      query = new Query(query);
    }
    else if (query instanceof globalThis.URL)
    {
      query = new Query(query.href);
    }

    // Iterate each layer
    const layers = this.GetLayers();
    for (let i = 0; i < layers.length; i++)
    {
      const entry = layers[i].Query(query, domains, state);
      if (entry) return entry;
    }
  }

  ResolveNull()
  {
    return {
      shortCircuit: true,
      format: "module",
      url: NULL_URL,
    };
  }

  ResolveError()
  {
    return {
      shortCircuit: true,
      format: "module",
      url: ERROR_URL,
    };
  }

  async ResolveResolved(parent)
  {
    if (parent.IsVolatile()) return this.ResolveNull(parent);

    this.index ??= 0;

    // const url = `data:text/javascript,const name = "${parent.GetNormalized()}";const id = ${parent.GetInstance()};import "/js/"`;
    // const href = parent.GetSpecifier();
    const href = decodeURIComponent((await parent.Resolve()).href);
    // const href = decodeURIComponent(parent.href);
    // const data = Buffer.from(`import * as Mod from "${parent.GetSpecifier()}";console.log("${parent.GetSpecifier()}", Mod);`, "base64");
    // const data = `import * as Mod from "${href}";console.log("${parent.GetSpecifier()}", Mod);`;
    const data = `import * as Mod from "${href}";`;
    const url = `data:text/javascript,${encodeURIComponent(data)}`;
    // console.log(href);
    this.#parent_map.set(url, parent);

    return {
      shortCircuit: true,
      format: "module",
      // url: `${RESOLVED_URL}?url=${await parent.Resolve()}`,
      // url: `${RESOLVED_URL}?url=${await parent.Resolve()}`,
      // url: (await parent.Resolve(undefined, true)).href,
      // url: `data:text/javascript,console.log("Hello! ${parent.GetNormalized()}, ${parent.GetInstance()}");`,
      url,
      // url: `data:text/javascript,import "/js/Tag.js";`,
    };
  }

  async ResolveResolved(parent)
  {
    if (parent.IsVolatile()) return this.ResolveNull(parent);

    const url = await parent.Resolve();
    url.searchParams.add("flag", "resolved");

    return {
      shortCircuit: true,
      format: "module",
      url: url.href,
    };
  }

  async ResolveResolved(parent)
  {
    // return this.ResolveNull();

    return {
      shortCircuit: true,
      format: "module",
      url: RESOLVED_URL,
    };
  }

  OnLoaded()
  {
    for (const entry of this.#unresolved)
    {
      // console.log("OnLoaded", entry);
      this.#unresolved.delete(entry);
    }
  }

  // QUESTION: Should static files import by their etag instead of their instance?
  async OnResolve(specifier, context, default_resolver)
  {
    if (context.conditions && (context.conditions[0] !== "node" || context.conditions[1] !== "import"))
    {
      console.warn("Unexpected import conditions", context.conditions, "on import", specifier);
    }

    if (specifier === "@self")
    {
      return {
        shortCircuit: true,
        format: "module",
        url: context.parentURL,
      };
    }
    else if (specifier === "@register")
    {
      return {
        shortCircuit: true,
        format: "module",
        url: REGISTER_URL,
      };
    }

    this.#requests += 1;

    if (this.data.resolve_skips.has(specifier))
    {
      const resolved = await default_resolver(specifier, context, default_resolver);
      
      // If we are in Contextify mode and it's a commonjs module
      if (this.IsContextifying() && resolved.format === "commonjs")
      {
        // console.log(specifier);

        // Then grab the importer File and resolve to it with the appropriate query parameters
        const resolver = await this.Query("/js/Loader/NodeModules/Resolve.js");

        const url = new URL(resolver);
        url.searchParams.set("source", resolved.url);
        url.searchParams.set("name", specifier); // Like "mongodb"

        return {
          format: "module",
          url: url.href,
          shortCircuit: true,
        };
      }

      return resolved;
    }

    const parent_url = context.parentURL;
    const parent_query = new Query(parent_url);
    const query = new Query(specifier);

    const prev_parent_url = this.#prev_parent_url;
    this.#prev_parent_url = parent_url;

    const is_resolved = !this.#unresolved.has(parent_url);
    if (prev_parent_url && parent_url !== prev_parent_url && this.#unresolved.has(prev_parent_url))
    {
      this.#unresolved.delete(prev_parent_url);
    }

    let parent;
    let entry;
    if (typeof(parent_url) === "string")
    {
      parent = this.Query(parent_query);

      if (!parent)
      {
        parent = this.#parent_map.get(parent_url);
      }

      if (!parent && !parent_url.endsWith("/taggly/Start.js"))
      {
        // The reason for this is that the parent can be used to check if
        // a certain import is allowed.
        // If there isn't a parent, we can't do that.
        // Also, AFAIK there is always a parent, so if there isn't,
        // something weird is happening
        throw new Error(`The file "${parent_url}" cannot import "${specifier}" because it is not in the layer hierarchy. For security, layer files can only be imported by other layer files.`);
      }

      this.#last_entry_resolved = parent;
    }

    if (specifier.startsWith("/flag#"))
    {
      if (!this.CountFlagRequests())
      {
        this.#requests -= 1;
      }

      const anchor = query.GetAnchor();
      if (anchor)
      {
        parent.Flag(anchor);

        if (anchor === "resolved")
        {
          // // console.log("Resolved", parent.GetNormalized());
          return this.ResolveResolved(parent);
        }
      }

      return this.ResolveNull();
    }

    // Absolute path, or node/browser style relative path
    if (specifier.startsWith("/") || specifier.startsWith(".") || specifier.startsWith("file:///"))
    {
      entry = this.Query(query, undefined, { parent });

      if (!entry)
      {
        throw new Error(`Failed to import a file or directory for specifier "${specifier}" from "${parent?.GetNormalized() ?? "UNKNOWN PARENT"}"`);
      }

      if (entry.IsIncremented())
      {
        await entry.Reload();
      }

      if (is_resolved)
      {
        // console.log(parent.GetNormalized(), "is resolved, so", specifier, "must be dynamic?");
      }

      await entry.ValidateImportFrom(parent);

      if (parent && (parent !== this.#loader) && !query.HasIgnore())
      {
        await entry.AddReference(parent);
        await parent.AddImport(entry);
      }

      const url = await entry.Resolve(parent);

      return {
        shortCircuit: true,
        format: "module",
        url: url.toString(),
      };
    }

    return await default_resolver(specifier, context, default_resolver);
  }

  OnResolveSync(specifier, context, default_resolver)
  {
    if (context.conditions && (context.conditions[0] !== "node" || context.conditions[1] !== "import"))
    {
      console.warn("Unexpected import conditions", context.conditions, "on import", specifier);
    }

    if (specifier === "@self")
    {
      return {
        shortCircuit: true,
        format: "module",
        url: context.parentURL,
      };
    }
    else if (specifier === "@register")
    {
      return {
        shortCircuit: true,
        format: "module",
        url: REGISTER_URL,
      };
    }

    this.#requests += 1;

    if (this.data.resolve_skips.has(specifier))
    {
      const resolved = default_resolver(specifier, context, default_resolver);
      
      // If we are in Contextify mode and it's a commonjs module
      if (this.IsContextifying() && resolved.format === "commonjs")
      {
        // console.log(specifier);

        // Then grab the importer File and resolve to it with the appropriate query parameters
        const resolver = this.Query("/js/Loader/NodeModules/Resolve.js");

        const url = new URL(resolver);
        url.searchParams.set("source", resolved.url);
        url.searchParams.set("name", specifier); // Like "mongodb"

        return {
          format: "module",
          url: url.href,
          shortCircuit: true,
        };
      }

      return resolved;
    }

    const parent_url = context.parentURL;
    const parent_query = new Query(parent_url);
    const query = new Query(specifier);

    const prev_parent_url = this.#prev_parent_url;
    this.#prev_parent_url = parent_url;

    const is_resolved = !this.#unresolved.has(parent_url);
    if (prev_parent_url && parent_url !== prev_parent_url && this.#unresolved.has(prev_parent_url))
    {
      this.#unresolved.delete(prev_parent_url);
    }

    let parent;
    let entry;
    if (typeof(parent_url) === "string")
    {
      parent = this.Query(parent_query);

      if (!parent)
      {
        parent = this.#parent_map.get(parent_url);
      }

      if (!parent && !parent_url.endsWith("/taggly/Start.js"))
      {
        // The reason for this is that the parent can be used to check if
        // a certain import is allowed.
        // If there isn't a parent, we can't do that.
        // Also, AFAIK there is always a parent, so if there isn't,
        // something weird is happening
        throw new Error(`The file "${parent_url}" cannot import "${specifier}" because it is not in the layer hierarchy. For security, layer files can only be imported by other layer files.`);
      }

      this.#last_entry_resolved = parent;
    }

    if (specifier.startsWith("/flag#"))
    {
      if (!this.CountFlagRequests())
      {
        this.#requests -= 1;
      }

      const anchor = query.GetAnchor();
      if (anchor)
      {
        parent.Flag(anchor);

        if (anchor === "resolved")
        {
          // // console.log("Resolved", parent.GetNormalized());
          return this.ResolveResolved(parent);
        }
      }

      return this.ResolveNull();
    }

    // Absolute path, or node/browser style relative path
    if (specifier.startsWith("/") || specifier.startsWith(".") || specifier.startsWith("file:///"))
    {
      entry = this.Query(query, undefined, { parent });

      if (!entry)
      {
        throw new Error(`Failed to import a file or directory for specifier "${specifier}" from "${parent?.GetNormalized() ?? "UNKNOWN PARENT"}"`);
      }

      if (entry.IsIncremented())
      {
        entry.ReloadSync();
      }

      if (is_resolved)
      {
        // console.log(parent.GetNormalized(), "is resolved, so", specifier, "must be dynamic?");
      }

      entry.ValidateImportFrom(parent);

      if (parent && (parent !== this.#loader) && !query.HasIgnore())
      {
        entry.AddReference(parent);
        parent.AddImport(entry);
      }

      const url = entry.Resolve(parent);

      return {
        shortCircuit: true,
        format: "module",
        url: url.toString(),
      };
    }

    return default_resolver(specifier, context, default_resolver);
  }

  Import(specifier)
  {
    return import(specifier);
  }

  async OnError(error)
  {
  }

  // async OnStartError(error)
  // {
  //   const {Error} = await import("/js/Error.js");
  //
  //   if (!(error instanceof Error))
  //   {
  //     error = new Error("Loader start error", { cause: error });
  //   }
  //
  //   console.error(error);
  //   console.error(error.toString());
  // }

  OnStartError(error)
  {
    // console.log("~~START ERROR~~");
    // console.error(error);
    // // throw error;

    const string = this.FormatError(error, "Start Error");
    console.error(string);
  }

  FormatHelper(error, type, builder)
  {
    builder.NL();
    builder.NL().RedBright(type).Add(": ").White(error.message);

    // if (error.cause) builder.NL().RedBright("Cause").Add(": ").White(error.cause.message);

    builder.NL();

    // this.PopNodeInternals();
    const stack = ErrorParser(error);

    builder.In();

    for (const {name, file, line, column} of stack)
    {
      // if (file.startsWith("node:internal/")) continue;

      const entry = this.Query(file);
      builder.NL("");

      if (name) builder.Function(name).Add(" at ");

      builder.Add("line ").Number(line).Add(" and column ").Number(column).Add(" in file ");

      if (entry)
      {
        builder.URL(entry.GetNormalized());
      }
      else
      {
        builder.URL(file);
      }
    }

    if (error.cause)
    {
      this.FormatHelper(error.cause, error.cause.name ?? error.cause.constructor.name, builder);
    }

    builder.Out();
    builder.NL();

    return builder;
  }

  FormatError(error, type = error.name ?? error.constructor.name)
  {
    const builder = new StringBuilder();
    this.FormatHelper(error, type, builder);
    // builder.NL();

    return builder.Render();
  }

  async OnResolveError(error)
  {
    const string = this.FormatError(error, "Resolve Error");
    console.error(string);
    
    // import("/js/Error.js")
    // .then(mod =>
    // {
    //   if (!(error instanceof mod.Error))
    //   {
    //     error = new mod.Error("Loader start error", {cause: error});
    //   }

    //   console.error(error);
    //   console.error(error.toString());
    // })
    // .catch(e =>
    // {
    //   console.log("~~RESOLVE ERROR~~", e);

    //   // Just print the original error the regular way
    //   console.error(error);
    // });

    return this.ResolveNull();
  }

  OnLoadError(error, url, context)
  {
    console.log("~~LOAD ERROR~~");
    // console.error(error);
  }

  GetEscape(code)
  {
    switch (code)
    {
      case 0: return "\\x00";
      case 8: return "\\x08";
      case 9: return "\\x09";
      case 10: return "\\x0a";
      case 11: return "\\x0b";
      case 12: return "\\x0c";
      case 13: return "\\x0d";
      case 34: return "\\x22";
      case 39: return "\\x27";
      case 92: return "\\x5c";
      case 96: return "\\x60";
    }
  }

  async EscapeEntryData(entry, data)
  {
    if (!data) return data;
    const type = await entry.GetMimeType();

    if (type === "text/javascript" || type === "application/json")
    {
      return data;
    }

    const reader = new TagglyBuffer(data);
    const writer = new TagglyBuffer(reader.GetSize());

    while (!reader.IsAtEnd())
    {
      const c1 = reader.ReadU8();

      if (c1 < 128)
      {
        const value = this.GetEscape(c1);
        if (value)
        {
          // console.log("Encoding", value);
          for (let i = 0; i < value.length; i++)
          {
            writer.WriteU8(value[i].charCodeAt());
          }
        }
        else
        {
          writer.WriteU8(c1);
        }
      }
      else if (c1 > 191 && c1 < 224)
      {
        const c2 = reader.ReadU8();
        writer.WriteU16((c1 & 31) << 6 | c2 & 63);
      }
      else if (c1 > 239 && c1 < 365)
      {
        // Surrogate Pair
        const c2 = reader.ReadU8();
        const c3 = reader.ReadU8();
        const c4 = reader.ReadU8();

        const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;

        writer.WriteU16(0xD800 + (u >> 10));
        writer.WriteU16(0xDC00 + (u & 1023));
      }
      else
      {
        const c2 = reader.ReadU8();
        const c3 = reader.ReadU8();

        writer.WriteU16((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }

    writer.Shrink();
    return new Uint8Array(writer.GetBuffer());
  }

  async FormatEntryData(entry, data)
  {
    if (!data) return data;

    switch (await entry.GetMimeType())
    {
      case "text/javascript":
      {
        return data; // Unchanged
      }

      // TODO: These need to perform encoding to work...
      case "text/html":
      {
        return Buffer.concat([
          HTML_BUFFER,
          data,
          END_BUFFER,
        ]);
      }
      case "text/css":
      {
        return Buffer.concat([
          CSS_BUFFER,
          data,
          END_BUFFER,
        ]);
      }
      case "application/json":
      {
        return Buffer.concat([
          JSON_BUFFER,
          data,
        ]);
      }
      default:
      {
        return Buffer.concat([
          DEFAULT_BUFFER,
          data,
          Buffer.from("\";"),
        ]);
      }
    }
  }

  async GetEntryData(entry)
  {
    const data = await entry.GetData();

    // Use a cached version, if it exists
    if (this.#formatted_data.has(data))
    {
      return this.#formatted_data.get(data);
    }

    if (data)
    {
      let result = data;
      result = await this.EscapeEntryData(entry, result);
      result = await this.FormatEntryData(entry, result);

      if (result && result !== data)
      {
        // console.log("Caching", new TextDecoder().decode(result));

        // If we performed any formatting, then cache the formatted data for performance
        this.#formatted_data.set(data, result);

        return result;
      }
    }

    if (this.UseResolvedFlag() && entry.IsPublic())
    {
      // const resolved = await entry.Resolve();
      // const specifier = await entry.GetSpecifier();
      // console.log("Resolving", `import "${specifier}";`);

      return Buffer.concat([
        data,

        // Buffer.from(`\nimport * as __LoaderModule from "/self";\nimport.meta.module = __LoaderModule;`, ENCODING),
        // Buffer.from(`\nimport "${specifier}";`, ENCODING),
        // Buffer.from(`\nimport * as __MODULE from "${specifier}";\nimport __REGISTER from "/js/Loader/Register.js";\n__REGISTER(import.meta, __MODULE);`, ENCODING),
        // Buffer.from(`\nimport * as __MODULE from "@self";\nimport __REGISTER from "@register";\n__REGISTER(import.meta, __MODULE);`, ENCODING),
        // Buffer.from(`\nimport * as __MODULE from "@self";\nimport __REGISTER from "/js/Loader/Register.js";\n__REGISTER(import.meta, __MODULE);`, ENCODING),
        // Buffer.from(`\nimport "${resolved.href}";`, ENCODING),

        // RESOLVED_FLAG,
      ]);
    }
    else
    {
      return data;
    }
  }

  Sleep(ms){ return new Promise(resolve => globalThis.setTimeout(resolve, ms)); }

  async OnLoad(url, context, default_load)
  {
    if (context.format === "module" && url.startsWith("file:/"))
    {
      const query = new Query(url);
      const entry = this.Query(query);
      entry?.Assert();

      this.#last_entry_loaded = entry;

      if (entry)
      {
        entry.Load();

        this.#unresolved.add(url);

        // console.log("Importing", entry.GetNormalized(), entry.GetImports().size, context);

        if (query.HasFlag())
        {
          const flag = query.GetFlag();
          const resolved = await entry.Resolve(entry);
          const href = resolved.href;
          // const href = new URL(url).searchParams.get("url");
          // console.log("Resolved!", href);

          if (entry.IsVolatile())
          {
            return {
              format: "module",
              responseURL: url,
              shortCircuit: true,
              source: "",
            };
          }
    
          return {
            format: "module",
            responseURL: url,
            shortCircuit: true,
            source: [
              // `export * from "${href}";`,
              // // `export {default} from "${href}";`,
              // // `export * as mod from "${url}";`,
              `import * as mod from "${href}";`,
              // // `import "${href}";`,
              // `console.log("Resolved ${entry.GetNormalized()}", mod);`,
              // `import {Registry} from "/js/Loader/Registry.js";`,
              // "",
              // `Registry.Add("${href}", mod);`,
            ].join("\n"),
          };
        }

        if (this.IsWrapping() && query.HasWrapper())
        {
          const resolved = await entry.Resolve(entry);
          const href = resolved.href;

          console.log("Wrapping", entry.GetNormalized());

          return {
            format: "module",
            responseURL: url,
            shortCircuit: true,
            source: [
              `export * from "${href}";`,
              // `export {default} from "${href}";`,
              // `export * as mod from "${url}";`,
              `import * as mod from "${href}";`,
              `import {Registry} from "/js/Loader/Registry.js";`,
              "",
              `if (Object.hasOwn(mod, "default")) throw new Error("File ${entry.GetNormalized()} has a default export, which is incompatible with using automatic export registration.");`,
              "",
              `Registry.Add("${href}", mod);`,
            ].join("\n"),
          };
        }

        this.#files += 1;

        await entry.Starting(url);
        const data = await this.GetEntryData(entry);

        // console.log(entry.GetNormalized());

        if (data)
        {
          this.#lines += entry.GetLines();
          this.#loaded.add(entry);

          // if (entry.GetNormalized() === "taggly/private/js/Stop.js")
          // {
          //   // await import("/js/Main.js");
          //   // await this.#loading;
          //   // const string = data.toString();
          //   console.log("Loading start...", this.#start.GetImports());
          // }

          // if (Math.random() > 0.95)
          // {
          //   console.log("Sleeping...", entry.GetNormalized());
          //   await this.Sleep(1000);
          // }

          return {
            format: "module",
            responseURL: url,
            shortCircuit: true,
            source: data,
          };
        }
      }
    }

    // console.log("Default loading", url);
    return default_load(url, context, default_load);
  }

  OnMessage(message)
  {
    let actions;
    try
    {
      actions = JSON.parse(message);
      this.Apply(...actions);
    }
    catch (error)
    {
      console.warn(`Failed to parse message "${message}" as JSON`);
      console.error(error);
    }
  }

  OnUncaughtException(...args)
  {
    // console.log(args);
  }

  Reload(force = false, throws = false, hard = false)
  {
    if (force !== true && this.GetReloadable() !== true)
    {
      return false;
    }

    const old_promise = this.GetReloadPromise();

    const reload_promise = new Promise(async (resolve, reject) =>
    {
      this.SetReloadable(false); // This should happen ASAP so that we don't reload multiple times

      await this.#loading;

      // // Inform the parent process that if this worker dies, it should NOT be
      // // auto restarted, because it died to a startup error
      // // If it restarted, it would just hit the same error all over again
      // this.Send("ALLOW_AUTO_RESTART", false);

      await old_promise;

      // await this.Sleep(1000);

      const parents = this.GetParentMap();
      parents.clear();

      this.data.instance += 1;

      try
      {
        if (this.#main)
        {
          this.#main();
          this.#main = undefined;
        }

        if (hard === true)
        {
          this.#start.Reimport();
        }

        // Attempt to reimport the loader, which will only happen if it has been incremented
        const mod = await import("/js/Loader.js");
        if (!Object.hasOwn(mod, "Loader"))
        {
          throw new Error(`Expected "/js/Loader.js" to export a Loader class`);
        }

        const loader = mod.Loader.Get();
        
        try
        {
          await loader.Start();
        }
        catch (error)
        {
          loader.OnStartError(error);
          return resolve(false);
        }

        // if (mod.Loader.Get() === this)
        // {
        //   // If the loader wasn't replaced, then just start as normal
        //   // Otherwise start will be called from the /js/Loader.js file
        //   await this.Start();
        // }

        return resolve(true);
      }
      catch (error)
      {
        const parts = [];
        // parts.push(C.Error("\nCompilation error:"));
        parts.push("\nCompilation error:");
        parts.push("\n\n   ", error);
        parts.push("\n");

        console.error(...parts);

        if (throws === true)
        {
          return reject(error);
        }
        else
        {
          return resolve(false); // Should this always reject?
        }
      }
      finally
      {
        // this.stop = performance.now();

        // console.log("Skipping log...");

        // // Log details as if the default was NOT prevented
        // this.LogLoaded();
      }
    });

    this.SetReloadPromise(reload_promise);

    return reload_promise;
  }

  OnReload()
  {
    this.Reload(true, false, false);
  }

  OnHardReload()
  {
    this.Reload(true, false, true);
  }

  OnKeyBackspace(){}
  OnKeySpace(){}
  OnKeyTab(){}
  OnKeyEnter(){}
  OnKeyShift(){}
  OnKeyCtrl(){}
  OnKeyAlt(){}
  OnKeyPause(){}
  OnKeyCapsLock(){}
  OnKeyEscape(){}
  OnKeyPageUp(){}
  OnKeyPageUp(){}
  OnKeyPageDown(){}
  OnKeyEnd(){}
  OnKeyHome(){}
  OnKeyLeftArrow(){}
  OnKeyUpArrow(){}
  OnKeyRightArrow(){}
  OnKeyDownArrow(){}
  OnKeyInsert(){}
  OnKeyDelete(){}
  OnKey0(){}
  OnKey1(){}
  OnKey2(){}
  OnKey3(){}
  OnKey4(){}
  OnKey5(){}
  OnKey6(){}
  OnKey7(){}
  OnKey8(){}
  OnKey9(){}
  OnKeyA(){}
  OnKeyB(){}
  OnKeyC(key){}
  OnKeyD(){}
  OnKeyE(){}
  OnKeyF(){}
  OnKeyG(){}
  OnKeyH(){}
  OnKeyI(){}
  OnKeyJ(){}
  OnKeyK(){}
  OnKeyL(){}
  OnKeyM(){}
  OnKeyN(){}
  OnKeyO(){}
  OnKeyP(){}
  OnKeyQ(){}
  OnKeyR(){}
  OnKeyS(){}
  OnKeyT(){}
  OnKeyU(){}
  OnKeyV(){}
  OnKeyW(){}
  OnKeyX(){}
  OnKeyY(){}
  OnKeyZ(){}
  OnKeyLeftWindowKey(){}
  OnKeyRightWindowKey(){}
  OnKeySelectKey(){}
  OnKeyNumpad0(){}
  OnKeyNumpad1(){}
  OnKeyNumpad2(){}
  OnKeyNumpad3(){}
  OnKeyNumpad4(){}
  OnKeyNumpad5(){}
  OnKeyNumpad6(){}
  OnKeyNumpad7(){}
  OnKeyNumpad8(){}
  OnKeyNumpad9(){}
  OnKeyMultiply(){}
  OnKeyAdd(){}
  OnKeySubtract(){}
  OnKeyDecimalPoint(){}
  OnKeyDivide(){}
  OnKeyF1(){}
  OnKeyF2(){}
  OnKeyF3(){}
  OnKeyF4(){}
  OnKeyF5(){}
  OnKeyF6(){}
  OnKeyF7(){}
  OnKeyF8(){}
  OnKeyF9(){}
  OnKeyF10(){}
  OnKeyF11(){}
  OnKeyF12(){}
  OnKeyNumLock(){}
  OnKeyScrollLock(){}
  OnAudioVolumeMute(){}
  OnAudioVolumeDown(){}
  OnAudioVolumeUp(){}
  OnLaunchMediaPlayer(){}
  OnLaunchApplication1(){}
  OnLaunchApplication2(){}
  OnKeySemiColon(){}
  OnKeyColon(){}
  OnKeyEqualSign(){}
  OnKeyComma(){}
  OnKeyDash(){}
  OnKeyPeriod(){}
  OnKeyForwardSlash(){}
  OnKeyGraveAccent(){}
  OnKeyOpenBracket(){}
  OnKeyBackSlash(){}
  OnKeyCloseBraket(){}
  OnKeySingleQuote(){}
  OnKeyDoubleQuote(){}
  OnKeyBackQuote(){}
  OnKeyUnknown(key){ console.log("Unknown key", key); }

  OnKeyE(key){ if (key.ctrl) this.OnHardReload(); }
  OnKeyR(key){ if (key.ctrl) this.OnReload(); }

  Remap(key, name)
  {
    key.name = name;
    return this.OnKey(key);
  }

  OnKey(key)
  {
    switch (key.name)
    {
      case "backspace": return this.OnKeyBackspace(key);
      case "space": return this.OnKeySpace(key);
      case "tab": return this.OnKeyTab(key);
      case "enter": return this.OnKeyEnter(key);
      case "return": return this.OnKeyEnter(key);
      case "shift": return this.OnKeyShift(key);
      case "ctrl": return this.OnKeyCtrl(key);
      case "alt": return this.OnKeyAlt(key);
      case "pause": return this.OnKeyPause(key);
      case "capslock": return this.OnKeyCapsLock(key);
      case "escape": return this.OnKeyEscape(key);
      case "pageup": return this.OnKeyPageUp(key);
      case "pageup": return this.OnKeyPageUp(key);
      case "pagedown": return this.OnKeyPageDown(key);
      case "end": return this.OnKeyEnd(key);
      case "home": return this.OnKeyHome(key);
      case "left": return this.OnKeyLeftArrow(key);
      case "up": return this.OnKeyUpArrow(key);
      case "right": return this.OnKeyRightArrow(key);
      case "down": return this.OnKeyDownArrow(key);
      case "insert": return this.OnKeyInsert(key);
      case "delete": return this.OnKeyDelete(key);
      case "0": return this.OnKey0(key);
      case "1": return this.OnKey1(key);
      case "2": return this.OnKey2(key);
      case "3": return this.OnKey3(key);
      case "4": return this.OnKey4(key);
      case "5": return this.OnKey5(key);
      case "6": return this.OnKey6(key);
      case "7": return this.OnKey7(key);
      case "8": return this.OnKey8(key);
      case "9": return this.OnKey9(key);
      case "a": return this.OnKeyA(key);
      case "b": return this.OnKeyB(key);
      case "c": return this.OnKeyC(key);
      case "d": return this.OnKeyD(key);
      case "e": return this.OnKeyE(key);
      case "f": return this.OnKeyF(key);
      case "g": return this.OnKeyG(key);
      case "h": return this.OnKeyH(key);
      case "i": return this.OnKeyI(key);
      case "j": return this.OnKeyJ(key);
      case "k": return this.OnKeyK(key);
      case "l": return this.OnKeyL(key);
      case "m": return this.OnKeyM(key);
      case "n": return this.OnKeyN(key);
      case "o": return this.OnKeyO(key);
      case "p": return this.OnKeyP(key);
      case "q": return this.OnKeyQ(key);
      case "r": return this.OnKeyR(key);
      case "s": return this.OnKeyS(key);
      case "t": return this.OnKeyT(key);
      case "u": return this.OnKeyU(key);
      case "v": return this.OnKeyV(key);
      case "w": return this.OnKeyW(key);
      case "x": return this.OnKeyX(key);
      case "y": return this.OnKeyY(key);
      case "z": return this.OnKeyZ(key);
      case "leftwindowkey": return this.OnKeyLeftWindowKey(key);
      case "rightwindowkey": return this.OnKeyRightWindowKey(key);
      case "selectkey": return this.OnKeySelectKey(key);
      case "numpad0": return this.OnKeyNumpad0(key);
      case "numpad1": return this.OnKeyNumpad1(key);
      case "numpad2": return this.OnKeyNumpad2(key);
      case "numpad3": return this.OnKeyNumpad3(key);
      case "numpad4": return this.OnKeyNumpad4(key);
      case "numpad5": return this.OnKeyNumpad5(key);
      case "numpad6": return this.OnKeyNumpad6(key);
      case "numpad7": return this.OnKeyNumpad7(key);
      case "numpad8": return this.OnKeyNumpad8(key);
      case "numpad9": return this.OnKeyNumpad9(key);
      case "multiply": return this.OnKeyMultiply(key);
      case "add": return this.OnKeyAdd(key);
      case "subtract": return this.OnKeySubtract(key);
      case "decimalpoint": return this.OnKeyDecimalPoint(key);
      case "divide": return this.OnKeyDivide(key);
      case "f1": return this.OnKeyF1(key);
      case "f2": return this.OnKeyF2(key);
      case "f3": return this.OnKeyF3(key);
      case "f4": return this.OnKeyF4(key);
      case "f5": return this.OnKeyF5(key);
      case "f6": return this.OnKeyF6(key);
      case "f7": return this.OnKeyF7(key);
      case "f8": return this.OnKeyF8(key);
      case "f9": return this.OnKeyF9(key);
      case "f10": return this.OnKeyF10(key);
      case "f11": return this.OnKeyF11(key);
      case "f12": return this.OnKeyF12(key);
      case "numlock": return this.OnKeyNumLock(key);
      case "scrolllock": return this.OnKeyScrollLock(key);
      case "volumemute": return this.OnAudioVolumeMute(key);
      case "volumedown": return this.OnAudioVolumeDown(key);
      case "volumeup": return this.OnAudioVolumeUp(key);
      case "mediaplayer": return this.OnLaunchMediaPlayer(key);
      case "application1": return this.OnLaunchApplication1(key);
      case "application2": return this.OnLaunchApplication2(key);
      case "semicolon": return this.OnKeySemiColon(key);
      case "colon": return this.OnKeyColon(key);
      case "equalsign": return this.OnKeyEqualSign(key);
      case "comma": return this.OnKeyComma(key);
      case "dash": return this.OnKeyDash(key);
      case "period": return this.OnKeyPeriod(key);
      case "forwardslash": return this.OnKeyForwardSlash(key);
      case "graveaccent": return this.OnKeyGraveAccent(key);
      case "openbracket": return this.OnKeyOpenBracket(key);
      case "backslash": return this.OnKeyBackSlash(key);
      case "closebraket": return this.OnKeyCloseBraket(key);
      case "singlequote": return this.OnKeySingleQuote(key);
      case "doublequote": return this.OnKeyDoubleQuote(key);
      case "backquote": return this.OnKeyBackQuote(key);
      case "backquote": return this.OnKeyBackQuote(key);
      case "openparenthesis":
      case "closeparenthesis":
      case "openbracket":
      case "closebracket":
      case "opencurlybracket":
      case "closecurlybracket":
      case "greaterthan":
      case "lessthan":
      case "percent":
      case "plus":
      case "underscore":
      case "exclamation":
      case "question":
      case "carat":
      case "hash":
      case "at":
      case "asterisk":
      case "and":
      case "tilde":
      case "minus":
      {
        return; // Ignore these for now cause I'm lazy
      }
      default:
      {
        switch (key.sequence)
        {
          case "'": return this.Remap(key, "singlequote");
          case "\"": return this.Remap(key, "doublequote");
          case "\`": return this.Remap(key, "backquote");
          case ",": return this.Remap(key, "comma");
          case ".": return this.Remap(key, "period");
          case "/": return this.Remap(key, "forwardslash");
          case "\\": return this.Remap(key, "backslash");
          case ";": return this.Remap(key, "semicolon");
          case ":": return this.Remap(key, "colon");
          case "(": return this.Remap(key, "openparenthesis");
          case ")": return this.Remap(key, "closeparenthesis");
          case "[": return this.Remap(key, "openbracket");
          case "]": return this.Remap(key, "closebracket");
          case "{": return this.Remap(key, "opencurlybracket");
          case "}": return this.Remap(key, "closecurlybracket");
          case ">": return this.Remap(key, "greaterthan");
          case "<": return this.Remap(key, "lessthan");
          case "%": return this.Remap(key, "percent");
          case "+": return this.Remap(key, "plus");
          case "_": return this.Remap(key, "underscore");
          case "!": return this.Remap(key, "exclamation");
          case "?": return this.Remap(key, "question");
          case "^": return this.Remap(key, "carat");
          case "#": return this.Remap(key, "hash");
          case "@": return this.Remap(key, "at");
          case "*": return this.Remap(key, "asterisk");
          case "&": return this.Remap(key, "and");
          case "~": return this.Remap(key, "tilde");
          case "-": return this.Remap(key, "minus");
          default: return this.OnKeyUnknown(key);
        }
      }
    }
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "KEY": return this.OnKey(...args);
      default:
      {
        // console.warn("Unknown action", action, args);
      }
    }
  }
}