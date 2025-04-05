import vm from "vm";

function Sandbox(host)
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
      else return Symbol(value.prototype.description);
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

  this.console = {
    log(...args){ args.unshift("[VM]"); return global.taggly.Contextify(host.console.log.apply(host.console, args)); },
    debug(...args){ args.unshift("[VM]"); return global.taggly.Contextify(host.console.debug.apply(host.console, args)); },
    info(...args){ args.unshift("[VM]"); return global.taggly.Contextify(host.console.info.apply(host.console, args)); },
    warn(...args){ args.unshift("[VM]"); return global.taggly.Contextify(host.console.warn.apply(host.console, args)); },
    error(...args){ args.unshift("[VM]"); return global.taggly.Contextify(host.console.error.apply(host.console, args)); },
    dir(...args){ args.unshift("[VM]"); return global.taggly.Contextify(host.console.dir.apply(host.console, args)); },
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

export class VirtualMachine
{
  constructor()
  {
    this.context = vm.createContext(undefined);

    this.options = {
      context: this.context,
    };

    const source = `(${Sandbox})`;

    const script = new vm.Script(source);
    const result = script.runInContext(this.context).call(this.context, global);
  }

  // Launch(context_file)
  // {
  //   async function Source(vm, parent_context)
  //   {
  //     const {Context} = await import("/js/Context.js");
  //
  //     const context = vm.createContext(new Context(parent_context));
  //
  //     const mod = new vm.SourceTextModule(source, {
  //       context,
  //       initializeImportMeta: (meta) =>
  //       {
  //         // Create the url string in the same context so that it doesn't use the global prototype
  //         meta.url = context.Contextify(file.href);
  //       },
  //     });
  //
  //     await mod.link(this.Linker.bind(this, file));
  //     await mod.evaluate();
  //   }
  //
  //   const mod = new vm.SourceTextModule(source, {
  //     context: this.context,
  //     initializeImportMeta: (meta) =>
  //     {
  //       // NOTE: this object is created in the top context. As such,
  //       // Object.getPrototypeOf(import.meta.prop) points to the
  //       // Object.prototype in the top context rather than that in
  //       // the contextified object.
  //
  //       // Create the url string in the same context so that it doesn't use the global prototype
  //       meta.url = this.context.taggly.Contextify(file.href);
  //       // meta.url = vm.runInContext(`"${file.href}"`, this.context);
  //     },
  //   });
  // }

  // Contextify(name, target)
  // {
  //   this.context[name] = new Proxy(target, {
  //     __proto__: null,
  //     construct()
  //     {
  //       return this;
  //     },
  //     getPrototypeOf(target)
  //     {
  //       // return host.Function.prototype;
  //     },
  //     get(object, property)
  //     {
  //       if (typeof(property) === "string")
  //       {
  //         console.log("GET", property);
  //       }
  //
  //       return target[property];
  //     },
  //     set(object, property, value)
  //     {
  //       console.log("SET", property);
  //       // target[property] = value;
  //       // return original[property];
  //       return true;
  //     },
  //     apply(object, property, args)
  //     {
  //       console.log("APPLY", property);
  //       return target[property].apply(object, args);
  //     },
  //   });
  // }

  // async Linker(url, specifier, referencing_module)
  // {
  //   const loader = global.taggly.GetLoader();
  //   const file = await loader.Search(url, specifier, ...this.domains);
  //   if (!file) throw new Error(`Failed to link "${specifier}" in VM "${url.href}"`);
  //
  //   const mod = await import(file.href);
  //
  //   const keys = Object.keys(mod);
  //   return new vm.SyntheticModule(keys, function()
  //   {
  //     for (let i = 0; i < keys.length; i++)
  //     {
  //       const key = keys[i];
  //       const val = mod[key];
  //
  //       this.setExport(key, val);
  //     }
  //   }, { context: referencing_module.context });
  // }
  //
  // async Linker(url, specifier, referencing_module)
  // {
  //   const loader = global.taggly.GetLoader();
  //   const file = await loader.Search(url, specifier, ...this.domains);
  //   if (!file) throw new Error(`Failed to link "${specifier}" in VM "${url.href}"`);
  //
  //   // const source = await file.Read();
  //   // console.log(source);
  //   // const mod = new vm.Script(source);
  //   // console.log(mod);
  //
  //   // const proto = Object.getPrototypeOf(referencing_module.context);
  //   // const proto = Object.getPrototypeOf(referencing_module.context);
  //   // console.log("Object::", proto.constructor === Object);
  //   // console.log("Object::", referencing_module.context.taggly);
  //   const context = referencing_module.context;
  //
  //   const mod = await import(file.href);
  //
  //   const keys = Object.keys(mod);
  //   return new vm.SyntheticModule(keys, function()
  //   {
  //     for (let i = 0; i < keys.length; i++)
  //     {
  //       const key = keys[i];
  //       const val = mod[key];
  //       // const key = context.taggly.Contextify(keys[i]);
  //       // const val = context.taggly.Contextify(mod[keys[i]]);
  //
  //       // Object.setPrototypeOf(this, Object.prototype);
  //
  //       // referencing_module.context.taggly.Contextify(val);
  //
  //       this.setExport(context.taggly.Contextify(key), context.taggly.Contextify(val));
  //       // this.setExport(key, val);
  //     }
  //   }, { context: referencing_module.context });
  // }

  async Linker(parent, loader, domains, specifier, referencingModule)
  {
    const context = this.context;

    const file = await loader.Search(parent, specifier, domains);
    if (file && file.GetLayerIndex() === parent.GetLayerIndex())
    {
      const data = await file.Read();
      return new vm.SourceTextModule(data.toString(), { context });
    }
    else
    {
      console.log("Linker Importing:", specifier);

      const mod = await loader.Import(specifier);

      const keys = Object.keys(mod);

      console.log("Imported", specifier, keys);

      return new vm.SyntheticModule(keys, function()
      {
        for (let i = 0; i < keys.length; i++)
        {
          const key = context.taggly.Contextify(keys[i]);
          const val = context.taggly.Contextify(mod[key]);

          this.setExport(key, val);
        }
      }, { context });
    }
  }

  async Linker(parent, loader, domains, specifier, referencingModule)
  {
    const context = this.context;

    const file = await loader.Query(specifier, domains);

    // console.log(file);
    // if (!file)
    // {
    //   console.log("No file for", specifier);
    // }

    // console.log(referencingModule);

    // const mod = await loader.Import(specifier);
    //
    // const keys = Object.keys(mod);
    //
    // console.log("Imported", specifier, keys);
    //
    // return new vm.SyntheticModule(keys, function()
    // {
    //   for (let i = 0; i < keys.length; i++)
    //   {
    //     const key = context.taggly.Contextify(keys[i]);
    //     const val = context.taggly.Contextify(mod[key]);
    //
    //     this.setExport(key, val);
    //   }
    // }, { context });

    if (file)
    {
      const data = await file.Read();
      return new vm.SourceTextModule(data.toString(), { context });
    }
    else
    {
      // console.log("No file for", specifier);

      const mod = await import(specifier);

      const keys = Object.keys(mod);

      // console.log("Imported", specifier, keys);

      return new vm.SyntheticModule(keys, function()
      {
        for (let i = 0; i < keys.length; i++)
        {
          const key = keys[i];
          const val = mod[key];
          // const key = context.taggly.Contextify(keys[i]);
          // const val = context.taggly.Contextify(mod[key]);

          this.setExport(key, val);
        }
      }, { context });
    }

    // const file = await loader.Search(parent, specifier, domains);
    // if (file && file.GetLayerIndex() === parent.GetLayerIndex())
    // {
    //   const data = await file.Read();
    //   return new vm.SourceTextModule(data.toString(), { context });
    // }
    // else
    // {
    //   console.log("Linker Importing:", specifier);
    //
    //   const mod = await loader.Import(specifier);
    //
    //   const keys = Object.keys(mod);
    //
    //   console.log("Imported", specifier, keys);
    //
    //   return new vm.SyntheticModule(keys, function()
    //   {
    //     for (let i = 0; i < keys.length; i++)
    //     {
    //       const key = context.taggly.Contextify(keys[i]);
    //       const val = context.taggly.Contextify(mod[key]);
    //
    //       this.setExport(key, val);
    //     }
    //   }, { context });
    // }
  }

  // async Linker(parent, loader, domains, specifier, referencingModule)
  // {
  //   const context = this.context;
  //
  //   // const file = await loader.Search(parent, specifier, domains);
  //   console.log("Linker Importing:", specifier);
  //
  //   const mod = await loader.Import(specifier);
  //
  //   const keys = Object.keys(mod);
  //
  //   console.log("Imported", specifier, keys);
  //
  //   return new vm.SyntheticModule(keys, function()
  //   {
  //     for (let i = 0; i < keys.length; i++)
  //     {
  //       // const key = keys[i];
  //       // const val = mod[key];
  //
  //       const key = context.taggly.Contextify(keys[i]);
  //       const val = context.taggly.Contextify(mod[key]);
  //
  //       this.setExport(key, val);
  //     }
  //   }, { context });
  // }

  async Run(file, loader, domains)
  {
    console.log("VM running", file.href);

    const source = await file.Read();

    const mod = new vm.SourceTextModule(source, {
      context: this.context,
      initializeImportMeta: (meta) =>
      {
        // NOTE: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.

        // Create the url string in the same context so that it doesn't use the global prototype
        meta.url = this.context.taggly.Contextify(file.href);
        // meta.url = vm.runInContext(`"${file.href}"`, this.context);
      },
    });

    // console.log("mod", mod);
    const link_result = await mod.link(this.Linker.bind(this, file, loader, domains));
    console.log("link_result", link_result);
    const evaluate_result = await mod.evaluate();
    console.log("evaluate_result", evaluate_result);
  }

  async Run(file, loader, domains)
  {
    console.log("VM running", file.href);

    const source = await file.Read();

    const mod = new vm.SourceTextModule(source, {
      context: this.context,
      initializeImportMeta: (meta) =>
      {
        // NOTE: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.

        // Create the url string in the same context so that it doesn't use the global prototype
        meta.url = this.context.taggly.Contextify(file.href);
        // meta.url = vm.runInContext(`"${file.href}"`, this.context);
      },
    });

    // console.log("mod", mod);
    const link_result = await mod.link(this.Linker.bind(this, file, loader, domains));
    console.log("link_result", link_result);
    const evaluate_result = await mod.evaluate();
    console.log("evaluate_result", evaluate_result);
  }
}
