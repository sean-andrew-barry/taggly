import "/flag#dangerous";

import vm from "vm";
import v8 from "v8";
import {Loader} from "/js/Loader.js";

// QUESTION: What if each VM import always includes like `import "/flag#my_vm"`
// This could make it clear to the loader what's virtual. Not sure if any use.

const loader = Loader.Get();

let index = 0;
let active_vm;
export class VM
{
  static GetActiveVM(){ return active_vm; }

  constructor({
    name = "VM",
    start = "/js/Start.js",
    domains = ["sandbox", "private", "public"],
  })
  {
    this.index = index++;
    this.name = name;
    this.start = start;
    this.domains = domains;

    this.context = vm.createContext(undefined, {
      name,
      codeGeneration: {
        strings: false,
        wasm: false,
      },
    });

    this.modules = new WeakMap();

    // console.log("this.context", this.context);
    // this.specifiers = new Map();
    this.start = 0;
    this.time = 0;

    return this.Initialize();
  }

  async Initialize()
  {
    const file = await this.GetLoader().Query("/js/Utility/Sandbox.js", this.domains);
    const source = await file.Read();

    const script = new vm.Script(`(${source})`);

    this.contextifier = script.runInContext(this.context).call(
      this.context,
      this,
    );

    return this;
  }

  async Link(base, specifier, dependency, referencing_module)
  {
    // console.log("Linking", dependency, "to", specifier);
    const result = await this.Compile(base, dependency, referencing_module.entry);

    if (!result)
    {
      throw new Error(`"${specifier}" unable to resolve dependency "${dependency}"`);
    }

    return result;
  }

  async Sandbox(base, specifier = "/js/Utility/Sandbox2.js")
  {
    const sandbox = await this.Compile(base, specifier);

    await sandbox.link((dependency, referencing_module) =>
    {
      return this.Link(base, specifier, dependency, referencing_module);
    });

    await sandbox.evaluate();

    return sandbox;
  }

  async Main(base, specifier = "/js/Start.js")
  {
    // const sandbox = await this.Sandbox(base, "/js/Utility/Sandbox2.js");
    //
    // this.sandbox = new sandbox.namespace.Sandbox(this);
    // this.sandbox.Initialize();
    // console.log(this.sandbox);

    const main = await this.Compile(base, specifier);

    await main.link((dependency, referencing_module) =>
    {
      // console.log("Linking", dependency);
      return this.Link(base, specifier, dependency, referencing_module);
    });

    await main.evaluate();

    return main;
  }

  async Load(base, specifier)
  {
    const module = await this.Compile(base, specifier);

    await module.link((dependency, referencing_module) =>
    {
      return this.Link(base, specifier, dependency, referencing_module);
    });

    console.log("Evaluating", specifier);
    try
    {
      // console.log(module);
      await module.evaluate();
    }
    catch (error)
    {
      console.error("Evaluation failed", error);
    }

    return module.namespace;
  }

  async Run()
  {
    const loader = this.GetLoader();

    let loader_module;
    let virtual_loader;
    let start_module;

    try
    {
      this.Activate("loader");
      loader_module = await this.Load(this.name, "/js/Loader.js");

      // const data = this.context.Contextify({
      //   domains: this.GetDomains(),
      // });

      const data = vm.runInContext(`({
        domains: ["${this.GetDomains().join(`", "`)}"],
      })`, this.context);

      virtual_loader = new loader_module.Loader(data);
    }
    catch (error)
    {
      throw error;
    }
    finally
    {
      this.Deactivate("loader");
    }
    // await virtual_loader.Start();

    const start = performance.now();

    try
    {
      this.Activate("start");
      start_module = await this.Load(this.name, "/js/Start.js");
      // await start_module.default;
      // this.context.console.log("start_module:", start_module);
      this.context.console.log(`Imported "/js/Start.js" after`, virtual_loader.Round(performance.now() - start), "ms");
    }
    catch (error)
    {
      throw error;
    }
    finally
    {
      this.Deactivate("start");
    }

    // try
    // {
    //   this.Activate("main");
    //   await start_module.default();
    // }
    // catch (error)
    // {
    //   throw error;
    // }
    // finally
    // {
    //   this.Deactivate("main");
    // }
  }

  async Run()
  {
    const loader = this.GetLoader();

    let loader_module;
    let virtual_loader;
    let start_module;

    try
    {
      this.Activate("loader");
      loader_module = await this.Load(this.name, "/js/Loader.js");

      // const data = this.context.Contextify({
      //   domains: this.GetDomains(),
      // });

      // const data = vm.runInContext(`({
      //   domains: ["${this.GetDomains().join(`", "`)}"],
      // })`, this.context);

      virtual_loader = loader_module.default;
    }
    catch (error)
    {
      throw error;
    }
    finally
    {
      this.Deactivate("loader");
    }
    // await virtual_loader.Start();

    const start = performance.now();

    try
    {
      this.Activate("start");
      start_module = await this.Load(this.name, "/js/Start.js");
      // await start_module.default;
      // this.context.console.log("start_module:", start_module);
      this.context.console.log(`Imported "/js/Start.js" after`, virtual_loader.Round(performance.now() - start), "ms");
    }
    catch (error)
    {
      throw error;
    }
    finally
    {
      this.Deactivate("start");
    }

    // try
    // {
    //   this.Activate("main");
    //   await start_module.default();
    // }
    // catch (error)
    // {
    //   throw error;
    // }
    // finally
    // {
    //   this.Deactivate("main");
    // }
  }

  async Compile(base, specifier, parent, dynamic = false)
  {
    // console.log(base, "compiling", specifier);

    const loader = this.GetLoader();
    const domains = this.GetDomains();
    const entry = await loader.Query(specifier, domains, { parent });

    // if (!entry || entry.IsInternal())
    if (!entry)
    {
      if (!parent) throw new Error(`Cannot import external module "${specifier}" without a parent`);
      if (!parent.IsTrusted()) throw new Error(`File "${parent.GetNormalized()}" is untrusted, so it cannot import external module "${specifier}"`);

      if (specifier.startsWith("/flag"))
      {
        return new vm.SyntheticModule([], function(){}, { context: this.context });
      }

      const mod = await import(specifier);
      console.log("Resolving synthetic module", specifier);

      if (this.modules.has(mod))
      {
        return this.modules.get(mod);
      }

      const promise = new Promise(async (resolve, reject) =>
      {
        const keys = Object.keys(mod);
        const context = this.context;
        const module = new vm.SyntheticModule(keys, function()
        {
          // QUESTION: This is imported by a trusted entry, so it does it get Contextified?
          for (let i = 0; i < keys.length; i++)
          {
            const key = keys[i];
            // const key = context.Contextify(keys[i]);

            const val = mod[key];
            // const val = context.Contextify(mod[key]);
            // const val = context.Contextify(mod[keys[i]]);

            // console.log("Exporting", key, val);
            this.setExport(key, val);
          }
        }, {
          identifier: specifier,
          context: this.context,
        });

        resolve(module);
      });

      this.modules.set(mod, promise);

      return promise;
    }

    if (this.modules.has(entry))
    {
      return this.modules.get(entry);
    }

    const promise = new Promise(async (resolve, reject) =>
    {
      const identifier = entry.href;
      // console.log("Importing", identifier);

      const data = await entry.GetData();
      const text = new TextDecoder().decode(data);

      let cached_data;
      if (dynamic !== true)
      {
        cached_data = entry.GetModuleCachedData();
      }

      const module = new vm.SourceTextModule(text, {
        identifier: identifier,
        context: this.context,
        cachedData: cached_data,

        initializeImportMeta: (meta) =>
        {
          // NOTE: this object is created in the top context. As such,
          // Object.getPrototypeOf(import.meta.prop) points to the
          // Object.prototype in the top context rather than that in
          // the contextified object.

          // QUESTION: What about including some sort of unique "key" in the meta
          // which must be passed to secure functions?
          // Can the meta itself be used like that?

          // TODO: Add the layer into the url
          const object = vm.runInContext(`({
            url: "file:///${base}${specifier}",
            vm: true,
            index: ${this.index},
          })`, this.context);

          meta.url = object.url;
          meta.vm = object.vm;
          meta.index = object.index;

          // console.log("initializeImportMeta", specifier, meta);
        },

        importModuleDynamically: (specifier, module, importAssertions) =>
        {
          // console.warn("~~~~Dynamic import", specifier, "from", entry.GetNormalized());
          return this.Compile(base, specifier, entry, true);
        },
      });

      module.entry = entry;

      if (!cached_data)
      {
        // NOTE: For some reason, using the cached data breaks on dynamic imports...
        // No idea why

        entry.SetModuleCachedData(module.createCachedData());
      }

      resolve(module);
    });

    this.modules.set(entry, promise);

    return promise;
  }

  Close()
  {
    this.closed = true;
    // this.context?.Close();

    // this.modules.clear();
    this.modules = new WeakMap();
    this.context = undefined;
    active_vm = undefined;

    console.log(this);
  }

  IsClosed(){ return this.closed === true; }

  Activate(name)
  {
    // if (active_vm !== this)
    // {
    //
    // }
    // this.GetLoader().Send("TIMEOUT_START", 100, this.GetName());

    // console.log("Activating", name);

    active_vm = this;
    this.start = performance.now();
    this.active = true;
  }

  Deactivate(name)
  {
    // this.GetLoader().Send("TIMEOUT_CANCEL");

    active_vm = undefined;
    const elapsed = performance.now() - this.start;
    this.time += elapsed;
    this.active = false;
    // console.log("Deactivating", name, this.time);
  }

  Sleep(ms)
  {
    return new globalThis.Promise(resolve => globalThis.setTimeout(resolve, ms));
  }

  GetHeapStatistics()
  {
    return v8.getHeapSpaceStatistics();
  }

  GetMemory()
  {
    // return vm.measureMemory({ mode: "detailed", execution: "eager" }).then(result => result.other.map(o => o.jsMemoryEstimate));
    // return vm.measureMemory({ mode: "detailed", execution: "eager" }).then(result => result.other);
    return vm.measureMemory({ mode: "detailed", execution: "eager" })
    .then(result => result.other.reverse()[this.index]?.jsMemoryEstimate / (1024 * 1024));
    // .then(result =>
    // {
    //   return result.jsMemoryEstimate / (1024 * 1024);
    // });
  }

  static GetMemory()
  {
    return vm.measureMemory({ mode: "detailed", execution: "eager" })
    .then(result => result.other.reverse().map(v => v.jsMemoryEstimate / (1024 * 1024)));
  }

  GetLoader(){ return loader; }
  GetHost(){ return globalThis; }
  GetContext(){ return this.context; }
  GetJSDOM(){ return undefined; }
  GetName(){ return this.name; }
  GetDomains(){ return this.domains; }
  GetIndex(){ return this.index; }
  GetNodeVM(){ return vm; }
}
