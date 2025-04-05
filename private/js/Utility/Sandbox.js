function Sandbox(vm)
{
  "use strict";

  const host = vm.GetHost();
  const name = vm.GetName();
  // const jsdom = vm.GetJSDOM();

  const global = this;
  this.global = this;

  // This is critical for security, otherwise the sandbox can be escaped using global.constructor
  // It is needed because the context object (the global) cannot be created in its own context
  Object.setPrototypeOf(global, Object.prototype);

  const proxies = new host.WeakMap();

  function ContextifyBoolean(value)
  {
    if (value === true) return true;
    else return false;
  }

  function ContextifyNumber(value)
  {
    if (value instanceof Number) return value;
    else return Number(value);
  }

  function ContextifyString(value)
  {
    if (value instanceof String) return value;
    else return String(value);
  }

  function ContextifySymbol(value)
  {
    if (value instanceof Symbol) return value;
    else
    {
      // console.log("Contextifying symbol", value);
      return value;
      // return Symbol(value.description);
    }
  }

  function ContextifyFunction(value)
  {
    // host.console.log("Contextifying function", value);

    if (value instanceof Function) return value; // Already in context

    const handler = host.Object.create(null);

    handler.apply = function(target, self, args)
    {
      // console.log("Applying...");
      try
      {
        return Contextify(target.apply(self, args));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.construct = function(target, args, new_target)
    {
      // console.log("Constructing...");
      try
      {
        // return Contextify(new target(...args));
        return Contextify(host.Reflect.construct(target, args));
      }
      catch (error)
      {
        throw Contextify(error);
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
        // const contextified = Contextify(val);
        // host.console.log("Getting", property, val, contextified);
        // return val;
        return Contextify(host.Reflect.get(target, property));
        // return Contextify(target[property]);
        // return target[property];
      }
      catch (error)
      {
        // host.console.log("~~~Error getting ", property);
        throw Contextify(error);
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

    const proxy = new Proxy(value, handler);
    proxies.set(value, proxy);
    return proxy;
  }

  function ContextifyObject(value)
  {
    if (value === null) return null;
    if (value instanceof Object) return value; // Already in context

    const handler = host.Object.create(null);

    handler.construct = function(target, args, new_target)
    {
      try
      {
        return Contextify(host.Reflect.construct(target, args));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    // handler.get = function(target, property)
    // {
    //   // host.console.log("~OBJECT~ Getting...", property);
    //   try
    //   {
    //     const descriptor = host.Object.getOwnPropertyDescriptor(target, property);
    //
    //     if (descriptor.value === undefined)
    //     {
    //       return undefined;
    //     }
    //     else if (descriptor.value === null)
    //     {
    //       return null;
    //     }
    //     else if (descriptor.get !== undefined)
    //     {
    //       console.log("Has a getter");
    //       return descriptor.get();
    //     }
    //
    //     if (descriptor.writable === false && descriptor.configurable === false)
    //     {
    //       // host.console.log("Unwritable and non-configurable", property, descriptor);
    //       return host.Reflect.get(target, property);
    //     }
    //
    //     return Contextify(host.Reflect.get(target, property));
    //   }
    //   catch (error)
    //   {
    //     throw Contextify(error);
    //   }
    // }

    // handler.get = function(target, property)
    // {
    //   try
    //   {
    //     const descriptor = host.Object.getOwnPropertyDescriptor(target, property);
    //
    //     if (descriptor.value === undefined)
    //     {
    //       return undefined;
    //     }
    //     else if (descriptor.value === null)
    //     {
    //       return null;
    //     }
    //     else if (descriptor.get !== undefined)
    //     {
    //       console.log("Has a getter");
    //       return descriptor.get();
    //     }
    //
    //     // host.console.log("~OBJECT~ Getting...", property);
    //
    //     if (descriptor.writable === false && descriptor.configurable === false)
    //     {
    //       // host.console.log("Unwritable and non-configurable", property, descriptor);
    //       return host.Reflect.get(target, property);
    //     }
    //
    //     // return host.Reflect.get(target, property);
    //     return Contextify(descriptor.value);
    //     // return descriptor.value;
    //     // return Contextify(host.Reflect.get(target, property));
    //   }
    //   catch (error)
    //   {
    //     throw Contextify(error);
    //   }
    // }

    handler.get = function(target, property, extra)
    {
      try
      {
        // host.console.log(extra);
        // host.console.log("Proxy.get", property, target, host.Reflect.get(target, property));
        // const descriptor = host.Object.getOwnPropertyDescriptor(target, property);
        //
        // if (descriptor.value === undefined)
        // {
        //   return undefined;
        // }
        // else if (descriptor.value === null)
        // {
        //   return null;
        // }
        // else if (descriptor.get !== undefined)
        // {
        //   console.log("Has a getter");
        //   return descriptor.get();
        // }
        //
        // // host.console.log("~OBJECT~ Getting...", property);
        //
        // if (descriptor.writable === false && descriptor.configurable === false)
        // {
        //   // host.console.log("Unwritable and non-configurable", property, descriptor);
        //   return host.Reflect.get(target, property);
        // }

        // return host.Reflect.get(target, property);
        // return Contextify(descriptor.value);
        // return descriptor.value;
        return Contextify(host.Reflect.get(target, property, extra));
        // return Contextify(target[property]);
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.getOwnPropertyDescriptor = function(target, property)
    {
      // host.console.log("~OBJECT~ getOwnPropertyDescriptor?", property);
      try
      {
        return Contextify(host.Reflect.getOwnPropertyDescriptor(target, property));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.has = function(target, property)
    {
      try
      {
        return Contextify(host.Reflect.has(target, property));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.set = function(target, property, value)
    {
      throw new Error(`Cannot set property "${property}" to "${value}" from sandboxed code`);
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
      // host.console.log("~OBJECT~ getPrototypeOf");
      // return Object.prototype;
      return host.Reflect.getPrototypeOf(target);
    }

    handler.setPrototypeOf = function(target)
    {
      // host.console.log("~OBJECT~ setPrototypeOf");
      throw new Error(`Sandboxed code cannot invoke setPrototypeOf on a Proxy object`);
    }

    handler.isExtensible = function(target)
    {
      // host.console.log("~OBJECT~ isExtensible");
      try
      {
        return Contextify(host.Reflect.isExtensible(target));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.preventExtensions = function(target)
    {
      host.console.log("~OBJECT~ preventExtensions");
      try
      {
        return Contextify(host.Reflect.preventExtensions(target));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.ownKeys = function(target)
    {
      // host.console.log("~OBJECT~ ownKeys");
      try
      {
        const keys = host.Reflect.ownKeys(target);

        // const keys = host.Reflect.ownKeys(target).filter(key =>
        // {
        //   const descriptor = host.Object.getOwnPropertyDescriptor(target, key);
        //   if (descriptor.configurable === false)
        //   {
        //     host.console.log("Key", key, "is not configurable");
        //     // return false;
        //   }
        //
        //   return true;
        // });

        // host.console.log(keys);

        // if (target === host)
        // {
        //   console.warn("Ownkeys on host global", keys);
        // }

        // return host.Reflect.ownKeys(target);
        const contextified = Contextify(keys);
        // console.log(contextified);
        return contextified;
        // return keys;
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    handler.enumerate = function(target)
    {
      // host.console.log("~OBJECT~ enumerate");
      try
      {
        return Contextify(host.Reflect.enumerate(target));
      }
      catch (error)
      {
        throw Contextify(error);
      }
    }

    // const proxy = new host.Proxy(createBaseObject(value), handler);
    const proxy = new host.Proxy(value, handler);
    proxies.set(value, proxy);
    return proxy;
  }

  function Contextify(value)
  {
    if (proxies.has(value)) return proxies.get(value);

    switch (typeof(value))
    {
      case "undefined": return undefined;
      case "boolean": return ContextifyBoolean(value);
      case "number": return ContextifyNumber(value);
      case "string": return ContextifyString(value);
      case "symbol": return ContextifySymbol(value);
      case "function": return ContextifyFunction(value);
      case "object": return ContextifyObject(value);
      default: throw new Error(`Cannot Contextify unknown object type "${typeof(value)}"`);
    }
  }

  global.GetMemory = function()
  {
    return Contextify(vm.GetMemory());
  }

  const n = `[${name}]`;
  global.console = {
    log(...args){ args.unshift(n); return Contextify(host.console.log.apply(host.console, args)); },
    debug(...args){ args.unshift(n); return Contextify(host.console.debug.apply(host.console, args)); },
    info(...args){ args.unshift(n); return Contextify(host.console.info.apply(host.console, args)); },
    warn(...args){ args.unshift(n); return Contextify(host.console.warn.apply(host.console, args)); },
    error(...args){ args.unshift(n); return Contextify(host.console.error.apply(host.console, args)); },
    dir(...args){ args.unshift(n); return Contextify(host.console.dir.apply(host.console, args)); },
    time(...args){},
    timeEnd(...args){},
    trace(...args){ return Contextify(host.console.trace.apply(host.console, args)); },
  };

  global.performance = {
    now(...args){ return Contextify(host.performance.now.apply(host.performance.now, args)); }
  };

  function Activate(name)
  {
    try
    {
      vm.Activate(name);
    }
    catch (error)
    {
      throw Contextify(error);
    }
  }

  function Deactivate(name)
  {
    try
    {
      vm.Deactivate(name);
    }
    catch (error)
    {
      throw Contextify(error);
    }
  }

  // const dom = new jsdom.JSDOM("<!DOCTYPE html></html>", {
  //   url: "https://localhost/",
  //   contentType: "text/html",
  //   pretendToBeVisual: true, // Enables requestAnimationFrame
  //   storageQuota: undefined,
  // });
  
  // global.window = Contextify(dom.window);

  // host.console.warn("WARNING: VirtualMachine is using external (unsafe) URL object");
  // global.URL ??= host.URL;

  // Expose access to the ABILITY to Contextify, but NOT the Contextify function itself
  global.Contextify = function(value)
  {
    return Contextify(value);
  }

  global.Close = function()
  {
    host.console.log("Closing VM");
    // vm.Close();
    global.window?.close();
  }

  global.URL ??= class URL
  {
    static createObjectURL(...args){ return Contextify(host.URL.createObjectURL(...args)); }
    static revokeObjectURL(...args){ return Contextify(host.URL.revokeObjectURL(...args)); }

    #instance;

    get hash(){ return Contextify(this.#instance.hash); }
    get host(){ return Contextify(this.#instance.host); }
    get hostname(){ return Contextify(this.#instance.hostname); }
    get href(){ return Contextify(this.#instance.href); }
    get origin(){ return Contextify(this.#instance.origin); }
    get password(){ return Contextify(this.#instance.password); }
    get pathname(){ return Contextify(this.#instance.pathname); }
    get port(){ return Contextify(this.#instance.port); }
    get protocol(){ return Contextify(this.#instance.protocol); }
    get search(){ return Contextify(this.#instance.search); }
    get searchParams(){ return Contextify(this.#instance.searchParams); }
    get username(){ return Contextify(this.#instance.username); }

    set hash(value){ return Contextify(this.#instance.hash = value); }
    set host(value){ return Contextify(this.#instance.host = value); }
    set hostname(value){ return Contextify(this.#instance.hostname = value); }
    set href(value){ return Contextify(this.#instance.href = value); }
    set origin(value){ return Contextify(this.#instance.origin = value); }
    set password(value){ return Contextify(this.#instance.password = value); }
    set pathname(value){ return Contextify(this.#instance.pathname = value); }
    set port(value){ return Contextify(this.#instance.port = value); }
    set protocol(value){ return Contextify(this.#instance.protocol = value); }
    set search(value){ return Contextify(this.#instance.search = value); }
    set searchParams(value){ return Contextify(this.#instance.searchParams = value); }
    set username(value){ return Contextify(this.#instance.username = value); }

    constructor(...args)
    {
      this.#instance = new host.URL(...args);
    }

    toString(...args){ return Contextify(this.#instance.toString(...args)); }
    toJSON(...args){ return Contextify(this.#instance.toJSON(...args)); }
  }

  global.URLSearchParams ??= class URLSearchParams
  {
    #instance;

    constructor(...args){ this.#instance = new host.URLSearchParams(...args); }

    append(...args){ return Contextify(this.#instance.append(...args)); }
    delete(...args){ return Contextify(this.#instance.delete(...args)); }
    entries(...args){ return Contextify(this.#instance.entries(...args)); }
    forEach(...args){ return Contextify(this.#instance.forEach(...args)); }
    get(...args){ return Contextify(this.#instance.get(...args)); }
    getAll(...args){ return Contextify(this.#instance.getAll(...args)); }
    has(...args){ return Contextify(this.#instance.has(...args)); }
    keys(...args){ return Contextify(this.#instance.keys(...args)); }
    set(...args){ return Contextify(this.#instance.set(...args)); }
    sort(...args){ return Contextify(this.#instance.sort(...args)); }
    toString(...args){ return Contextify(this.#instance.toString(...args)); }
    toJSON(...args){ return Contextify(this.#instance.toJSON(...args)); }
  }

  global.TextEncoder ??= class TextEncoder
  {
    #instance;

    constructor(...args){ this.#instance = new host.TextEncoder(...args); }

    encode(...args){ return Contextify(this.#instance.encode(...args)); }
    encodeInto(...args){ return Contextify(this.#instance.encodeInto(...args)); }
    get encoding(){ return Contextify(this.#instance.encoding); }
    set encoding(value){ return Contextify(this.#instance.encoding = value); }
  }

  global.TextDecoder ??= class TextDecoder
  {
    #instance;

    constructor(...args){ this.#instance = new host.TextDecoder(...args); }

    decode(...args){ return Contextify(this.#instance.decode(...args)); }

    get encoding(){ return Contextify(this.#instance.encoding); }
    set encoding(value){ return Contextify(this.#instance.encoding = value); }

    get fatal(){ return Contextify(this.#instance.fatal); }
    set fatal(value){ return Contextify(this.#instance.fatal = value); }

    get ignoreBOM(){ return Contextify(this.#instance.ignoreBOM); }
    set ignoreBOM(value){ return Contextify(this.#instance.ignoreBOM = value); }
  }

  global.setTimeout = function(callback, delay, ...args)
  {
    if (vm.IsClosed()) throw new Error(`VM is closed`);

    return Contextify(host.setTimeout(() =>
    {
      try
      {
        Activate("setTimeout");
        return callback(...args);
      }
      catch (error)
      {
        throw Contextify(error);
      }
      finally
      {
        Deactivate("setTimeout");
      }
    }, delay));
  }

  global.setInterval = function(callback, delay, ...args)
  {
    if (vm.IsClosed()) throw new Error(`VM is closed`);

    return Contextify(host.setInterval(() =>
    {
      if (vm.IsClosed()) throw new Error(`VM is closed`);

      try
      {
        Activate("setInterval");
        host.console.log("setInterval...");
        return callback(...args);
      }
      catch (error)
      {
        throw Contextify(error);
      }
      finally
      {
        Deactivate("setInterval");
      }
    }, delay));
  }

  global.setImmediate = function(callback)
  {
    return Contextify(host.setImmediate(() =>
    {
      try
      {
        Activate("setImmediate");
        return callback();
      }
      catch (error)
      {
        throw Contextify(error);
      }
      finally
      {
        Deactivate("setImmediate");
      }
    }));
  }

  global.queueMicrotask = function(callback)
  {
    return Contextify(host.queueMicrotask(() =>
    {
      try
      {
        Activate("queueMicrotask");
        return callback();
      }
      catch (error)
      {
        throw Contextify(error);
      }
      finally
      {
        Deactivate("queueMicrotask");
      }
    }));
  }

  global.clearTimeout = function(value)
  {
    try
    {
      return Contextify(host.clearTimeout(value));
    }
    catch (error)
    {
      throw Contextify(error);
    }
  }

  global.clearInterval = function(value)
  {
    try
    {
      return Contextify(host.clearInterval(value));
    }
    catch (error)
    {
      throw Contextify(error);
    }
  }

  global.clearImmediate = function(value)
  {
    try
    {
      return Contextify(host.clearImmediate(value));
    }
    catch (error)
    {
      throw Contextify(error);
    }
  }

  global.process = {
    version: Contextify(host.process.version),
    connected: Contextify(host.process.connected),
    arch: Contextify(host.process.arch),
    platform: Contextify(host.process.platform),

    // // WARNING: These may not be safe, but they are used by /js/Console.js
    // stdout: Contextify(host.process.stdout),
    // stderr: Contextify(host.process.stderr),

    nextTick(callback, ...args)
    {
      return Contextify(host.process.nextTick(() =>
      {
        try
        {
          Activate("nextTick");
          return callback(...args);
        }
        catch (error)
        {
          throw Contextify(error);
        }
        finally
        {
          Deactivate("nextTick");
        }
      }));
    },
  };

  const global_then = global.Promise.prototype.then;
  const global_catch = global.Promise.prototype.catch;
  const global_finally = global.Promise.prototype.finally;
  
  global.Promise.prototype.then = function(resolve, reject)
  {
    if (resolve)
    {
      const original_resolve = resolve;
      resolve = (...args) =>
      {
        try
        {
          Activate("resolve");
          return original_resolve(...args);
        }
        catch (error)
        {
          throw Contextify(error);
        }
        finally
        {
          Deactivate("resolve");
        }
      };
    }

    if (reject)
    {
      const original_reject = reject;
      reject = (...args) =>
      {
        try
        {
          Activate("reject");
          return original_reject(...args);
        }
        catch (error)
        {
          throw Contextify(error);
        }
        finally
        {
          Deactivate("reject");
        }
      };
    }
  
    return global_then.call(this, resolve, reject);
  };

  function EscapeUndefined(value, seen)
  {
  }

  function EscapeBoolean(value, seen)
  {
  }

  function EscapeString(value, seen)
  {
    // if (value instanceof host.String)
    // {
    //   throw new Error(`String escaped!`);
    // }

    Escape(value.constructor, seen);
  }

  function EscapeSymbol(value, seen)
  {
    // if (value instanceof host.Symbol)
    // {
    //   throw new Error(`Symbol escaped!`);
    // }
    Escape(value.constructor, seen);
  }

  function EscapeNumber(value, seen)
  {
    if (value instanceof host.Number)
    {
      throw new Error(`Number escaped!`);
    }

    Escape(value.constructor, seen);
  }

  function EscapeFunction(value, seen)
  {
    if (value === host.Function)
    {
      console.error("Function escaped", value);
      throw new Error(`Function escaped!`);
    }

    if (seen.has(value))
    {
      return;
    }
    else
    {
      seen.add(value);
    }

    return EscapeObject(value, seen);
  }

  function EscapeObject(value, seen)
  {
    if (value === null) return;

    if (value === host)
    {
      throw new Error(`Escaped with true global!`);
    }

    if (seen.has(value))
    {
      return;
    }
    else
    {
      seen.add(value);
    }

    // if (value instanceof host.Object)
    // {
    //   throw new Error(`Object escaped!`);
    // }

    for (const key of host.Reflect.ownKeys(value))
    {
      const val = value[key];

      Escape(key, seen);
      Escape(val, seen);

      // Escape(Object.getOwnPropertyDescriptor(value, key), seen);
    }

    // for (const descriptor of Object.getOwnPropertyDescriptors(value))
    // {
    //   Escape(descriptor, seen);
    // }

    Escape(host.Object.getPrototypeOf(value), seen);
    Escape(value.constructor, seen);
  }

  function Escape(value, seen)
  {
    switch (typeof(value))
    {
      case "undefined": return EscapeUndefined(value, seen);
      case "boolean": return EscapeBoolean(value, seen);
      case "string": return EscapeString(value, seen);
      case "symbol": return EscapeSymbol(value, seen);
      case "number": return EscapeNumber(value, seen);
      case "function": return EscapeFunction(value, seen);
      case "object": return EscapeObject(value, seen);
      default: throw new Error(`Unknown type "${typeof(value)}"`);
    }
  }

  global.Escape = function(...values)
  {
    const seen = new WeakSet();

    for (const value of values)
    {
      Escape(value, seen);
    }
  }

  global.IsProxied = function(value)
  {
    return proxied.has(value);
  }

  global.is_virtual_machine = true;

  return Contextify;
}
