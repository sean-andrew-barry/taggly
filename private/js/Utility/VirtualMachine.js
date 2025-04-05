import vm from "vm";
import {VirtualMachine as Base} from "/js/Utility/VirtualMachine.js?after=/taggly/private/";
import {Loader} from "/js/Loader.js";
import {jsdom} from "/js/External/JSDOM.js";

const loader = Loader.Get();

function Sandbox(host, name, jsdom)
{
  "use strict";

  // This is critical for security, otherwise the sandbox can be escaped using global.constructor
  Object.setPrototypeOf(this, Object.prototype);

  const global = this;
  const proxies = new host.WeakMap();

  function createBaseObject(obj)
  {
    host.console.log("createBaseObject", obj);

  	let base;
  	if (typeof(obj) === "function")
    {
  		try
      {
  			new new host.Proxy(obj, {
  				__proto__: null,
  				construct()
          {
  					return this;
  				}
  			})();

  			base = function() {};
  			base.prototype = null;
        host.console.log("~~~~~~~~~~~~~~~~~~~~~~~~~", base);
  		}
      catch (e)
      {
        host.console.log("~~~~~~~~~~~~~~~~~~~~~~~~~", e);
  			base = () => {};
  		}
  	}
    else if (host.Array.isArray(obj))
    {
  		base = [];
  	}
    else
    {
      host.console.log("~~~~~~~~~~~~~~~~~~~~~~~~~", { __proto__: null });
  		return { __proto__: null };
  	}

  	if (!Reflect.setPrototypeOf(base, null))
    {
  		// Should not happen
  		return null;
  	}

  	return base;
  }

  this.taggly = {
    IsSandboxed(){ return true; },

    IsTopContext(object)
    {
      if (object instanceof host.Function) return true;
      else if (object instanceof host.Object) return true;
      else return false;
    },

    // IsTopContext(object)
    // {
    //   if (object === null) return false;
    //   else if (object === undefined) return false;
    //   else if (object === Function) return false;
    //   else if (object === host.Function) return true;
    //   else
    //   {
    //     const proto = Object.getPrototypeOf(object);
    //     if (proto) return this.IsTopContext(proto);
    //     else return false;
    //   }
    // },

    // Contextify(object)
    // {
    //   const proto = Object.getPrototypeOf(object);
    //   console.log("Contextifying", object, proto);
    //
    //   // switch (proto)
    //   // {
    //   //   case option:
    //   //   {
    //   //     break;
    //   //   }
    //   //   default:
    //   //   {
    //   //   }
    //   // }
    //
    //   if (proto !== Object.prototype)
    //   {
    //     Object.setPrototypeOf(object, Object.prototype);
    //   }
    // },

    ContextifyBoolean(value)
    {
      if (value === true) return true;
      else return false;
    },

    ContextifyNumber(value)
    {
      if (value instanceof Number) return value;
      else return Number(value);
    },

    ContextifyString(value)
    {
      if (value instanceof String) return value;
      else return String(value);
    },

    ContextifySymbol(value)
    {
      if (value instanceof Symbol) return value;
      else return Symbol(value.description);
      // else return Symbol(value.prototype.description);
    },

    ContextifyFunction(value)
    {
      // host.console.log("Contextifying function", value);

      if (value instanceof Function) return value; // Already in context

      const handler = host.Object.create(null);

      handler.apply = function(target, self, args)
      {
        // console.log("Applying...");
        try
        {
          return global.taggly.Contextify(target.apply(self, args));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.construct = function(target, args, new_target)
      {
        // console.log("Constructing...");
        try
        {
          // return global.taggly.Contextify(new target(...args));
          return global.taggly.Contextify(host.Reflect.construct(target, args));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.get = function(target, property, receiver)
      {
        // host.console.log("Getting...", property);
        try
        {
          // const config = host.Object.getOwnPropertyDescriptor(target, property);
  				// if (config && config.configurable === false && config.writable === false)
          // {
  				// 	return target[property];
  				// }

          // const val = host.Reflect.get(target, property);
          // const contextified = global.taggly.Contextify(val);
          // host.console.log("Getting", property, val, contextified);
          // return val;
          return global.taggly.Contextify(host.Reflect.get(target, property));
          // return global.taggly.Contextify(target[property]);
          // return target[property];
        }
        catch (error)
        {
          // host.console.log("~~~Error getting ", property);
          throw global.taggly.Contextify(error);
        }
      }

      handler.deleteProperty = function(target)
      {
        host.console.log("deleteProperty?");
      }

      handler.preventExtensions = function(target)
      {
        host.console.log("preventExtensions?");
      }

      handler.isExtensible = function(target)
      {
        host.console.log("isExtensible?");
      }

      handler.getOwnPropertyDescriptor = function(target)
      {
        host.console.log("getOwnPropertyDescriptor?");
      }

      handler.getPrototypeOf = function(target)
      {
        host.console.log("Get prototype of!!!");
        return Function.prototype;
      }

      handler.setPrototypeOf = function(target)
      {
        throw new Error(`Sandboxed code cannot invoke setPrototypeOf on a Proxy function`);
      }

      // const base = function()
      // {
      //
      // };
      // // const proto = Object.getPrototypeOf(value);
      // // base.prototype = proto;
      //
      // const proto = {
      //   bar_prop: "bar val"
      // };

      // const proto = Object.getPrototypeOf(value);
      // Object.setPrototypeOf(value, new Proxy(proto, {
      //   get(target, property)
      //   {
      //     host.console.log("Function proxy get", property);
      //     // return global.taggly.Contextify(target[property]);
      //     return target[property];
      //   },
      // }));

      // const base = value;

      // const base = new host.Proxy(value, {
      //   // __proto__: null,
      //   // construct()
      //   // {
      //   //   return this;
      //   // },
      //   get(target, property)
      //   {
      //     host.console.log("Function proxy get", property);
      //     // return global.taggly.Contextify(target[property]);
      //     return target[property];
      //   },
      // });

      // const base = Object.create(value);

      // const base = class extends value
      // {
      //
      // }
      // base.prototype = Object.create(value.prototype);
      // base.prototype = host.Reflect.getPrototypeOf(value);
      // host.Reflect.setPrototypeOf(base, host.Reflect.getPrototypeOf(value));

      // Object.defineProperty(value, "prototype", {
      //   value: value.prototype,
      //   enumerable: false, // so that it does not appear in 'for in' loop
      //   writable: true,
      //   configurable: true,
      // });

      // host.console.log(base.CreateElement, value.CreateElement);
      // // const base = {__proto__: null};
      //


      // setPrototypeOf

      // const base = value;

      // host.Reflect.setPrototypeOf(base, value);
      // base.prototype = null;
      // base.prototype = Object.getPrototypeOf(value);

      // const base = class extends value
      // {
      //
      // }

      // const base = new host.Proxy(value, {
      //   __proto__: null,
      //   construct()
      //   {
			// 		return this;
			// 	},
      // });

      // const base = class extends value
      // {
      //   // static get prototype()
      //   // {
      //   //
      //   // }
      // }

      // const base = new host.Proxy(value, {
      //   // __proto__: null,
      //   // construct()
      //   // {
      //   //   return this;
      //   // },
      //   get(target, property)
      //   {
      //     host.console.log("Function proxy get", property);
      //     return global.taggly.Contextify(target[property]);
      //     // return target[property];
      //   },
      // });

      // base.prototype = new Proxy(base.prototype, {
      //
      // });

      // const proto = Object.getPrototypeOf(base);
      // Object.setPrototypeOf(base, new Proxy(proto, {
      //   get(target, property)
      //   {
      //     host.console.log("Function proxy get", property);
      //     // return global.taggly.Contextify(target[property]);
      //     return target[property];
      //   },
      // }));

      const proxy = new Proxy(value, handler);
      proxies.set(value, proxy);
      return proxy;
    },

    ContextifyObject(value)
    {
      if (value === null) return null;
      if (value instanceof Object) return value; // Already in context

      const handler = host.Object.create(null);

      handler.construct = function(target, args, new_target)
      {
        try
        {
          return global.taggly.Contextify(host.Reflect.construct(target, args));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.get = function(target, property)
      {
        host.console.log("~OBJECT~ Getting...", property);
        try
        {
          return global.taggly.Contextify(host.Reflect.get(target, property));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.getOwnPropertyDescriptor = function(target)
      {
        host.console.log("~OBJECT~ getOwnPropertyDescriptor?");
      }

      handler.has = function(target, property)
      {
        try
        {
          return global.taggly.Contextify(host.Reflect.has(target, property));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.set = function(target, property, value)
      {
        throw new Error(`Cannot modify from sandboxed code`);
        // try
        // {
        //   property = this.Contextify(property);
        //   value = this.Contextify(value);
        //
        //   return this.Contextify(host.Reflect.set(target, property, value));
        // }
        // catch (error)
        // {
        //   throw this.Contextify(error);
        // }
      }

      handler.getPrototypeOf = function(target)
      {
        host.console.log("~OBJECT~ getPrototypeOf");
        return Object.prototype;
      }

      handler.setPrototypeOf = function(target)
      {
        host.console.log("~OBJECT~ setPrototypeOf");
        throw new Error(`Sandboxed code cannot invoke setPrototypeOf on a Proxy object`);
      }

      handler.isExtensible = function(target)
      {
        host.console.log("~OBJECT~ isExtensible");
        try
        {
          return global.taggly.Contextify(host.Reflect.isExtensible(target));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.preventExtensions = function(target)
      {
        host.console.log("~OBJECT~ preventExtensions");
        try
        {
          return global.taggly.Contextify(host.Reflect.preventExtensions(target));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.ownKeys = function(target)
      {
        host.console.log("~OBJECT~ ownKeys");
        try
        {
          return global.taggly.Contextify(host.Reflect.ownKeys(target));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      handler.enumerate = function(target)
      {
        host.console.log("~OBJECT~ enumerate");
        try
        {
          return global.taggly.Contextify(host.Reflect.enumerate(target));
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }

      // const proxy = new host.Proxy(createBaseObject(value), handler);
      const proxy = new host.Proxy(value, handler);
      proxies.set(value, proxy);
      return proxy;
    },

    Contextify(value)
    {
      if (proxies.has(value)) return proxies.get(value);

      switch (typeof(value))
      {
        case "undefined": return undefined;
        case "boolean": return this.ContextifyBoolean(value);
        case "number": return this.ContextifyNumber(value);
        case "string": return this.ContextifyString(value);
        case "symbol": return this.ContextifySymbol(value);
        case "function": return this.ContextifyFunction(value);
        case "object": return this.ContextifyObject(value);
        default: throw new Error(`Unknown object type "${typeof(value)}"`);
      }
    },
  };

  function Activate()
  {

  }

  const dom = new jsdom.JSDOM("<!DOCTYPE html></html>", {
    url: "https://localhost/",
    contentType: "text/html",
    pretendToBeVisual: true, // Enables requestAnimationFrame
    storageQuota: undefined,
  });

  this.window = global.taggly.Contextify(dom.window);

  this.setTimeout = function setTimeout(callback, delay, ...args)
  {
    return global.taggly.Contextify(host.setTimeout(function setTimeoutSandboxWrapper()
    {
      try
      {
        Activate();
        return callback(...args);
      }
      catch (error)
      {
        throw global.taggly.Contextify(error);
      }
    }, delay));
  }

  this.setInterval = function setInterval(callback, delay, ...args)
  {
    return global.taggly.Contextify(host.setInterval(function setIntervalSandboxWrapper()
    {
      try
      {
        Activate();
        return callback(...args);
      }
      catch (error)
      {
        throw global.taggly.Contextify(error);
      }
    }, delay));
  }

  this.setImmediate = function setImmediate(callback)
  {
    return global.taggly.Contextify(host.setImmediate(function setImmediateSandboxWrapper()
    {
      try
      {
        Activate();
        return callback();
      }
      catch (error)
      {
        throw global.taggly.Contextify(error);
      }
    }));
  }

  this.queueMicrotask = function queueMicrotask(callback)
  {
    return global.taggly.Contextify(host.queueMicrotask(function queueMicrotaskSandboxWrapper()
    {
      try
      {
        Activate();
        return callback();
      }
      catch (error)
      {
        throw global.taggly.Contextify(error);
      }
    }));
  }

  this.clearTimeout = function clearTimeout(object)
  {
    return global.taggly.Contextify(host.clearTimeout(object));
  }

  this.clearInterval = function clearInterval(object)
  {
    return global.taggly.Contextify(host.clearInterval(object));
  }

  this.clearImmediate = function clearImmediate(object)
  {
    return global.taggly.Contextify(host.clearImmediate(object));
  }

  const n = `[${name}]`;
  this.console = {
    log(...args){ args.unshift(n); return global.taggly.Contextify(host.console.log.apply(host.console, args)); },
    debug(...args){ args.unshift(n); return global.taggly.Contextify(host.console.debug.apply(host.console, args)); },
    info(...args){ args.unshift(n); return global.taggly.Contextify(host.console.info.apply(host.console, args)); },
    warn(...args){ args.unshift(n); return global.taggly.Contextify(host.console.warn.apply(host.console, args)); },
    error(...args){ args.unshift(n); return global.taggly.Contextify(host.console.error.apply(host.console, args)); },
    dir(...args){ args.unshift(n); return global.taggly.Contextify(host.console.dir.apply(host.console, args)); },
    time(...args){},
    timeEnd(...args){},
    trace(...args){ return global.taggly.Contextify(host.console.trace.apply(host.console, args)); },
  };

  this.process = {
    version: this.taggly.Contextify(host.process.version),
    connected: this.taggly.Contextify(host.process.connected),
    arch: this.taggly.Contextify(host.process.arch),
    platform: this.taggly.Contextify(host.process.platform),

    nextTick(callback, ...args)
    {
      return global.taggly.Contextify(host.process.nextTick(function nextTickSandboxWrapper()
      {
        try
        {
          Activate();
          return callback(...args);
        }
        catch (error)
        {
          throw global.taggly.Contextify(error);
        }
      }));
    },
  };

  this.global = this;
}

let active_vm;
export class VirtualMachine extends Base
{
  static GetActiveVM(){ return active_vm; }
  static IsActive(){ return active_vm !== undefined; }

  constructor(name = "VM")
  {
    super();

    this.context = vm.createContext();

    this.options = {
      context: this.context,
    };

    this.name = name;
    // this.modules = new Map();
    this.specifiers = new Map();
    this.modules = new WeakMap();

    return new Promise(async (resolve, reject) =>
    {
      try
      {
        const domains = loader.GetDomains();
        const file = await loader.Query("/js/Utility/Sandbox.js", domains);
        const source = await file.Read();

        const script = new vm.Script(`(${source})`);

        this.contextifier = script.runInContext(this.context).call(
          this.context,
          this,
        );

        resolve(this);
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  Sleep(ms)
  {
    return new globalThis.Promise(resolve => globalThis.setTimeout(resolve, ms));
  }

  async Main(base, specifier)
  {
    console.log("VM executing main", specifier);

    // const domains = loader.GetDomains();
    // const file = await loader.Query(specifier, domains);
    //
    // const code = await file.Read();

    let result;
    result = await this.Register(base, specifier);
    // result = await this.Evaluate(base, specifier);

    console.log("~~~~~~~~~~~~~~~~~~~~Result:", result);
  }

  async _Main(base, specifier)
  {
    console.log("VM executing main", specifier);

    // const domains = loader.GetDomains();
    // const file = await loader.Query(specifier, domains);
    //
    // const code = await file.Read();

    // result = await this.Register(base, specifier);
    // result = await this.Evaluate(base, specifier);

    const domains = this.GetDomains();
    const entry = await loader.Query(specifier, domains);

    const module = await this.CreateSourceTextModule(base, specifier, entry);

    await module.link(async (dependency, referencing_module) =>
    {
      const Query = loader.GetQueryClass();
      const query = new Query(dependency);

      // Create a copy
      const parameters = new URLSearchParams(query.parameters);
      parameters.append("sandbox", base);

      const href = query.specifier + "?" + parameters.toString();
      console.log("Linking", href);
      const mod = await import(href);

      console.log("Mod:", mod);

      // const mod = await import();
    });

    console.log("VM Result:", module);
  }

  GetHost(){ return global; }
  GetJSDOM(){ return jsdom; }
  GetName(){ return this.name; }

  Active(active = true)
  {
    if (active === true)
    {
      loader.Send("TIMEOUT_START", 100, this.GetName());

      active_vm = this;
      console.log("Activating VM", this.GetName());
    }
    else
    {
      loader.Send("TIMEOUT_CANCEL");

      active_vm = undefined;
      console.log("Deactivating VM", this.GetName());
    }

    this.active = active;
  }

  Activate()
  {
    loader.Send("TIMEOUT_START", 100, this.GetName());

    active_vm = this;
    this.active = true;
  }

  Deactivate()
  {
    loader.Send("TIMEOUT_CANCEL");

    active_vm = undefined;
    this.active = false;
  }

  Contextify(name, target)
  {
    this.context[name] = new Proxy(target, {
      __proto__: null,
      construct()
      {
        return this;
      },
      getPrototypeOf(target)
      {
        // return host.Function.prototype;
      },
      get(object, property)
      {
        if (typeof(property) === "string")
        {
          console.log("GET", property);
        }

        return target[property];
      },
      set(object, property, value)
      {
        console.log("SET", property);
        // target[property] = value;
        // return original[property];
        return true;
      },
      apply(object, property, args)
      {
        console.log("APPLY", property);
        return target[property].apply(object, args);
      },
    });
  }

  async Linker(original, referencing_module)
  {
    const Query = loader.GetQueryClass();
    const query = new Query(original);
    const specifier = query.GetSpecifier();

    if (this.modules.has(specifier))
    {
      const mod = this.modules.get(specifier);

      if (mod !== referencing_module)
      {
        console.log("Pseudo importing", specifier);
        // if (mod.status === "unlinked")
        // {
        //   await mod.link(this.Linker.bind(this));
        //   await mod.evaluate();
        // }

        return mod;
      }
    }

    const mod = await import(specifier);
    const keys = Object.keys(mod);

    // console.log("Imported", specifier, keys);

    const synthetic_module = new vm.SyntheticModule(keys, function()
    {
      for (let i = 0; i < keys.length; i++)
      {
        const key = keys[i];
        const val = mod[key];

        this.setExport(key, val);
      }
    }, { context: this.context });

    // Cache the synthetic_module for performance
    this.modules.set(specifier, synthetic_module);

    return synthetic_module;
  }

  Query(base, specifier)
  {
  }

  async Linker(base, specifier, referencing_module)
  {
    const entry = await loader.Query(specifier, this.GetDomains());
    if (entry) return this.modules.get(entry);

    // return await this.Import(base, specifier, referencing_module);
  }

  async ImportExternal(base, specifier, parent)
  {
    const mod = await import(specifier);

    if (this.modules.has(mod))
    {
      return this.modules.get(mod);
    }

    // console.log("Importing external module", specifier, parent.entry.href);

    const keys = Object.keys(mod);

    const synthetic_module = new vm.SyntheticModule(keys, function()
    {
      for (let i = 0; i < keys.length; i++)
      {
        const key = keys[i];
        const val = mod[key];

        this.setExport(key, val);
      }
    }, { context: this.context });

    // Cache the synthetic_module for performance
    this.modules.set(mod, synthetic_module);

    return synthetic_module;
  }

  async Import(base, specifier, parent)
  {
    let domains;
    if (parent)
    {
      domains = parent.entry.GetDomains().slice();
    }
    else
    {
      domains = loader.GetDomains().slice();
    }

    domains.unshift("sandbox");

    // const domains = loader.GetDomains();
    // const domains = ["private", "public"];
    const entry = await loader.Query(specifier, domains);

    if (!entry)
    {
      return await this.ImportExternal(base, specifier, parent);
    }

    if (this.modules.has(entry))
    {
      return this.modules.get(entry);
    }

    // console.log("Importing", specifier);

    const promise = new Promise(async (resolve, reject) =>
    {
      try
      {
        const code = await entry.Read();
        const url = `file:///${base}${specifier}`;

        const source_module = new vm.SourceTextModule(code, {
          identifier: entry.href,
          context: this.context,
          cachedData: undefined, // TODO: This could be very powerful
          initializeImportMeta: (meta) =>
          {
            // NOTE: this object is created in the top context. As such,
            // Object.getPrototypeOf(import.meta.prop) points to the
            // Object.prototype in the top context rather than that in
            // the contextified object.

            // QUESTION: What about including some sort of unique "key" in the meta
            // which must be passed to secure functions?

            // // Create the url string in the same context so that it doesn't use the global prototype
            // meta.url = this.context.taggly.Contextify(url);

            meta.url = vm.runInContext(`"${url}"`, this.context);
            meta.vm = true;
          },
          // TODO: Handle dynamic imports
          importModuleDynamically: (specifier, module, importAssertions) =>
          {
          },
        });

        source_module.entry = entry;

        await source_module.link(this.Linker.bind(this, base));

        resolve(source_module);

        await source_module.evaluate();
      }
      catch (error)
      {
        reject(error);
      }
    });

    this.modules.set(entry, promise);

    return promise;
  }

  async Import(base, specifier, parent)
  {
    let domains;
    if (parent)
    {
      domains = parent.entry.GetDomains().slice();
    }
    else
    {
      domains = loader.GetDomains().slice();
    }

    domains.unshift("sandbox");

    // const domains = loader.GetDomains();
    // const domains = ["private", "public"];
    const entry = await loader.Query(specifier, domains);

    if (!entry)
    {
      return await this.ImportExternal(base, specifier, parent);
    }

    if (this.modules.has(entry))
    {
      return this.modules.get(entry);
    }

    // console.log("Importing", specifier);

    const code = await entry.Read();
    const url = `file:///${base}${specifier}`;

    const source_module = new vm.SourceTextModule(code, {
      identifier: entry.href,
      context: this.context,
      cachedData: undefined, // TODO: This could be very powerful
      initializeImportMeta: (meta) =>
      {
        // NOTE: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.

        // QUESTION: What about including some sort of unique "key" in the meta
        // which must be passed to secure functions?

        // // Create the url string in the same context so that it doesn't use the global prototype
        // meta.url = this.context.taggly.Contextify(url);

        meta.url = vm.runInContext(`"${url}"`, this.context);
        meta.vm = true;
      },
      // TODO: Handle dynamic imports
      importModuleDynamically: (specifier, module, importAssertions) =>
      {
      },
    });

    console.log(source_module.dependencySpecifiers);

    source_module.entry = entry;

    for (const dependency of source_module.dependencySpecifiers)
    {

    }

    const promise = new Promise(async (resolve, reject) =>
    {
      try
      {
        await source_module.link(this.Linker.bind(this, base));

        resolve(source_module);

        await source_module.evaluate();
      }
      catch (error)
      {
        reject(error);
      }
    });

    this.modules.set(entry, promise);

    return promise;
  }

  GetDomains()
  {
    const domains = loader.GetDomains().slice();
    domains.unshift("sandbox");

    return domains;
  }

  async CreateSourceTextModule(base, specifier, entry)
  {
    const code = await entry.Read();
    const url = `file:///${base}${specifier}`;

    return new vm.SourceTextModule(code, {
      identifier: entry.href,
      context: this.context,
      cachedData: undefined, // TODO: This could be very powerful
      initializeImportMeta: (meta) =>
      {
        // NOTE: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.

        // QUESTION: What about including some sort of unique "key" in the meta
        // which must be passed to secure functions?

        // // Create the url string in the same context so that it doesn't use the global prototype
        // meta.url = this.context.taggly.Contextify(url);

        meta.url = vm.runInContext(`"${url}"`, this.context);
        meta.vm = true;
      },
      // TODO: Handle dynamic imports
      importModuleDynamically: (specifier, module, importAssertions) =>
      {
      },
    });
  }

  async Register(base, specifier, parent)
  {
    const domains = this.GetDomains();
    const entry = await loader.Query(specifier, domains);

    if (this.modules.has(entry))
    {
      return this.modules.get(entry);
    }

    // console.log("Registering", specifier);

    let promise;
    if (entry)
    {
      promise = new Promise(async (resolve, reject) =>
      {
        try
        {
          const code = await entry.Read();
          const url = `file:///${base}${specifier}`;

          const module = new vm.SourceTextModule(code, {
            identifier: entry.href,
            context: this.context,
            cachedData: undefined, // TODO: This could be very powerful
            initializeImportMeta: (meta) =>
            {
              // NOTE: this object is created in the top context. As such,
              // Object.getPrototypeOf(import.meta.prop) points to the
              // Object.prototype in the top context rather than that in
              // the contextified object.

              // QUESTION: What about including some sort of unique "key" in the meta
              // which must be passed to secure functions?

              // // Create the url string in the same context so that it doesn't use the global prototype
              // meta.url = this.context.taggly.Contextify(url);

              meta.url = vm.runInContext(`"${url}"`, this.context);
              meta.vm = true;
            },
            // TODO: Handle dynamic imports
            importModuleDynamically: (specifier, module, importAssertions) =>
            {
            },
          });

          // module.entry = entry;

          await module.link((dependency, referencing_module) =>
          {
            return this.Register(base, dependency, entry);
          });

          console.log("Linked", specifier, module.status);

          resolve(module);
        }
        catch (error)
        {
          console.error("~~~~~~~~~~~~~~~~~~~~~~~ERROR~~~~~", error);
          reject(error);
        }
      });

      this.modules.set(entry, promise);
    }
    else
    {
      const mod = await import(specifier);

      if (this.modules.has(mod))
      {
        return this.modules.get(mod);
      }

      promise = new Promise(async (resolve, reject) =>
      {
        try
        {
          const keys = Object.keys(mod);

          const module = new vm.SyntheticModule(keys, function()
          {
            for (let i = 0; i < keys.length; i++)
            {
              const key = keys[i];
              const val = mod[key];

              this.setExport(key, val);
            }
          }, { context: this.context });

          await module.link((dependency, referencing_module) =>
          {
            return this.Register(base, dependency);
          });

          // console.log("SyntheticModule", specifier, module.status);

          resolve(module);
        }
        catch (error)
        {
          console.error("~~~~~~~~~~~~~~~~~~~~~~~ERROR~~~~~");
          reject(error);
        }
      });

      this.modules.set(mod, promise);
    }

    // promise.then(module =>
    // {
    //   if (module.status !== "linked")
    //   {
    //     console.warn("Not linked!", module);
    //   }
    //
    //   // console.log("Evaluating", module.identifier);
    //   return module.evaluate().then(() =>
    //   {
    //     console.log("Evaluated", module.status, specifier);
    //   });
    // });

    return promise;

    // for (const dependency of source_module.dependencySpecifiers)
    // {
    //   await this.Register(base, dependency, entry);
    // }

    // await source_module.link((dependency, referencing_module) =>
    // {
    //   return this.Evaluate(base, dependency, entry);
    // });

    // console.log(source_module.dependencySpecifiers);
    // console.log(source_module);

    // console.log(source_module.dependencySpecifiers);

    // return source_module;
  }

  Register(base, specifier, parent)
  {
    if (this.specifiers.has(specifier))
    {
      return this.specifiers.get(specifier);
    }

    // console.log("Registering", specifier);

    const promise = new Promise(async (resolve, reject) =>
    {
      try
      {
        const domains = this.GetDomains();
        const entry = await loader.Query(specifier, domains);

        let module;
        if (entry)
        {
          if (this.modules.has(entry))
          {
            console.log("Using cached module for entry", entry.href);
            module = this.modules.get(entry);
          }
          else
          {
            const code = await entry.Read();
            const url = `file:///${base}${specifier}`;

            module = new vm.SourceTextModule(code, {
              identifier: entry.href,
              context: this.context,
              // cachedData: undefined, // TODO: This could be very powerful
              initializeImportMeta: (meta) =>
              {
                // NOTE: this object is created in the top context. As such,
                // Object.getPrototypeOf(import.meta.prop) points to the
                // Object.prototype in the top context rather than that in
                // the contextified object.

                // QUESTION: What about including some sort of unique "key" in the meta
                // which must be passed to secure functions?

                // Create the url string in the same context so that it doesn't use the global prototype
                meta.url = vm.runInContext(`"${url}"`, this.context);
                // meta.vm = true;
              },
              // TODO: Handle dynamic imports
              importModuleDynamically: (specifier, module, importAssertions) =>
              {
                console.warn("~~Dynamic import", specifier);
              },
            });

            this.modules.set(entry, module);
          }
        }
        else
        {
          const mod = await import(specifier);

          const keys = Object.keys(mod);
          // console.log(specifier, keys);
          module = new vm.SyntheticModule(keys, function()
          {
            for (let i = 0; i < keys.length; i++)
            {
              const key = keys[i];
              const val = mod[key];

              this.setExport(key, val);
            }
          }, {
            identifier: specifier,
            context: this.context,
          });
        }

        this.Sleep(1000).then(() =>
        {
          if (module.status !== "linked" && module.status !== "evaluated")
          // if (module.status !== "evaluated")
          {
            console.log("After 1 second", module.status, specifier);
          }
        });

        await module.link(async (dependency, referencing_module) =>
        {
          const result = await this.Register(base, dependency, entry);

          // console.log("linked", specifier, "to", result.identifier);
          return result;
        });

        // console.log("Linked", module.status, specifier);

        resolve(module);
      }
      catch (error)
      {
        console.error("~~~~~~~~~~~~~~~~~~~~~~~ERROR~~~~~");
        reject(error);
      }
    });

    this.specifiers.set(specifier, promise);

    // promise.then(module =>
    // {
    //   if (module.status !== "linked")
    //   {
    //     console.warn("Not linked!", module);
    //   }
    //
    //   // console.log("Evaluating", module.identifier);
    //   return module.evaluate().then(() =>
    //   {
    //     // console.log("Evaluated", module.status, specifier);
    //   });
    // });

    return promise;

    // for (const dependency of source_module.dependencySpecifiers)
    // {
    //   await this.Register(base, dependency, entry);
    // }

    // await source_module.link((dependency, referencing_module) =>
    // {
    //   return this.Evaluate(base, dependency, entry);
    // });

    // console.log(source_module.dependencySpecifiers);
    // console.log(source_module);

    // console.log(source_module.dependencySpecifiers);

    // return source_module;
  }

  async Evaluate()
  {
    for (const [specifier, mod] of this.modules)
    {
      if (mod.status === "unlinked")
      {
        await mod.link(this.Linker.bind(this));
      }

      if (mod.status === "linked")
      {
        console.log("Running", specifier, mod.status);

        await mod.evaluate();
      }

      // break;
    }
  }

  async Evaluate(mod)
  {
    this.Active(true);
    await mod.link(this.Linker.bind(this));
    await mod.evaluate();
    this.Active(false);
  }

  async Evaluate(base, specifier, parent)
  {
    const domains = this.GetDomains();

    const entry = await loader.Query(specifier, domains);

    if (!entry)
    {
      return await this.ImportExternal(base, specifier, parent);
    }

    const source_module = this.modules.get(entry);

    // if (source_module.status === "unlinked")
    // {
    //   console.log("Linking", specifier);
    //   await source_module.link((dependency, referencing_module) =>
    //   {
    //     return this.Evaluate(base, dependency, entry);
    //   });
    //   // await source_module.link(async (dependency, referencing_module) =>
    //   // {
    //   //   console.log("Linker?", specifier, dependency);
    //   //   const entry = await loader.Query(dependency, domains);
    //   //
    //   //   const mod = this.modules.get(entry);
    //   //   console.log("Mod:", mod);
    //   // });
    // }

    // console.log("Evaluating", specifier, source_module.status);

    // if (source_module.status === "")
    // {
    //   console.log("Evaluating", specifier, source_module.status);
    //   await source_module.evaluate();
    // }

    return source_module;
  }

  async Evaluate(base, specifier, parent)
  {
    console.log("Evaluating", specifier);

    const domains = this.GetDomains();
    const entry = await loader.Query(specifier, domains);

    let module;
    if (entry)
    {
      module = this.modules.get(entry);
    }
    else
    {
      const mod = await import(specifier);
      module = this.modules.get(mod);
    }

    if (!module)
    {
      throw new Error(`No module found when evaluating "${specifier}"`);
    }

    for (const dependency of module.dependencySpecifiers)
    {
      await this.Evaluate(base, dependency, module);
    }

    if (module.status === "linked")
    {
      await module.evaluate();
      console.log("Evaluated", module.status, specifier);
    }

    return module;
  }
}
