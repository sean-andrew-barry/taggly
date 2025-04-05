const original_global = globalThis;

export class Sandbox
{
  constructor(vm)
  {
    this.vm = vm;

    // const host = vm.GetHost(); // The enclosing global object
    // const global = vm.GetContext(); // The virtual global object

    this.proxies = new WeakMap();
    // this.name = vm.GetName();
    // this.context = vm.GetContext();
  }

  Initialize()
  {
    const context = this.GetContext();
    const host = this.GetHost();

    // host.console.log("~~~~INT?", Object.getOwnPropertyNames(globalThis));

    globalThis.global = globalThis;

    if (context !== globalThis || context !== global || context !== original_global)
    {
      // console.log(context !== globalThis, context !== global, context !== original_global);
      // console.log(globalThis);
      host.console.log(context, global === globalThis);
      throw new Error(`Invalid context object!`);
    }

    if (host === globalThis || host === global || host === original_global)
    {
      throw new Error(`Invalid host object!`);
    }

    context.is_virtual_machine = true;

    // This is critical for security, otherwise the sandbox can be escaped using global.constructor
    // It is needed because the context object (the global) cannot be created in its own context
    Object.setPrototypeOf(context, Object.prototype);

    context.process = {
      version: this.Contextify(host.process.version),
      connected: this.Contextify(host.process.connected),
      arch: this.Contextify(host.process.arch),
      platform: this.Contextify(host.process.platform),

      // WARNING: These may not be safe, but they are used by /js/Console.js
      stdout: this.Contextify(host.process.stdout),
      stderr: this.Contextify(host.process.stderr),

      nextTick: (callback, ...args) =>
      {
        return this.Contextify(host.process.nextTick(() =>
        {
          try
          {
            this.Activate("nextTick");
            return callback(...args);
          }
          catch (error)
          {
            throw this.Contextify(error);
          }
          finally
          {
            this.Deactivate("nextTick");
          }
        }));
      },
    };

    context.setTimeout = (callback, delay, ...args) =>
    {
      return this.Contextify(host.setTimeout(() =>
      {
        try
        {
          this.Activate("setTimeout");
          return callback(...args);
        }
        catch (error)
        {
          throw this.Contextify(error);
        }
        finally
        {
          this.Deactivate("setTimeout");
        }
      }, delay));
    }

    context.setInterval = (callback, delay, ...args) =>
    {
      return this.Contextify(host.setInterval(() =>
      {
        try
        {
          this.Activate("setInterval");
          return callback(...args);
        }
        catch (error)
        {
          throw this.Contextify(error);
        }
        finally
        {
          this.Deactivate("setInterval");
        }
      }, delay));
    }

    context.setImmediate = (callback) =>
    {
      return this.Contextify(host.setImmediate(() =>
      {
        try
        {
          this.Activate("setImmediate");
          return callback();
        }
        catch (error)
        {
          throw this.Contextify(error);
        }
        finally
        {
          this.Deactivate("setImmediate");
        }
      }));
    }

    context.queueMicrotask = (callback) =>
    {
      return this.Contextify(host.queueMicrotask(() =>
      {
        try
        {
          this.Activate("queueMicrotask");
          return callback();
        }
        catch (error)
        {
          throw this.Contextify(error);
        }
        finally
        {
          this.Deactivate("queueMicrotask");
        }
      }));
    }

    context.clearTimeout = (value) =>
    {
      try
      {
        return this.Contextify(host.clearTimeout(value));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    context.clearInterval = (value) =>
    {
      try
      {
        return this.Contextify(host.clearInterval(value));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    context.clearImmediate = (value) =>
    {
      try
      {
        return this.Contextify(host.clearImmediate(value));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }
  }

  ContextifyBoolean(value)
  {
    if (value === true) return true;
    else return false;
  }

  ContextifyNumber(value)
  {
    if (value instanceof Number) return value;
    else return Number(value);
  }

  ContextifyString(value)
  {
    if (value instanceof String) return value;
    else return String(value);
  }

  ContextifySymbol(value)
  {
    if (value instanceof Symbol) return value;
    else
    {
      // console.log("Contextifying symbol", value);
      return value;
      // return Symbol(value.description);
    }
  }

  ContextifyFunction(value)
  {
    // host.console.log("Contextifying function", value);

    if (value instanceof Function) return value; // Already in context

    const host = this.GetHost();
    const proxies = this.GetProxies();

    const handler = host.Object.create(null);

    handler.apply = (target, self, args) =>
    {
      // console.log("Applying...");
      try
      {
        return this.Contextify(target.apply(self, args));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.construct = (target, args, new_target) =>
    {
      // console.log("Constructing...");
      try
      {
        // return Contextify(new target(...args));
        return this.Contextify(host.Reflect.construct(target, args));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.get = (target, property, receiver) =>
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
        return this.Contextify(host.Reflect.get(target, property));
        // return Contextify(target[property]);
        // return target[property];
      }
      catch (error)
      {
        // host.console.log("~~~Error getting ", property);
        throw this.Contextify(error);
      }
    }

    handler.deleteProperty = (target) =>
    {
      host.console.log("deleteProperty?");
    }

    handler.preventExtensions = (target) =>
    {
      host.console.log("preventExtensions?");
    }

    handler.isExtensible = (target) =>
    {
      host.console.log("isExtensible?");
    }

    handler.getOwnPropertyDescriptor = (target) =>
    {
      host.console.log("getOwnPropertyDescriptor?");
    }

    handler.getPrototypeOf = (target) =>
    {
      host.console.log("Get prototype of!!!");
      return Function.prototype;
    }

    handler.setPrototypeOf = (target) =>
    {
      throw new Error(`Sandboxed code cannot invoke setPrototypeOf on a Proxy function`);
    }

    const proxy = new Proxy(value, handler);
    proxies.set(value, proxy);
    return proxy;
  }

  ContextifyObject(value)
  {
    if (value === null) return null;
    if (value instanceof Object) return value; // Already in context

    const host = this.GetHost();
    const handler = host.Object.create(null);

    handler.construct = (target, args, new_target) =>
    {
      try
      {
        return this.Contextify(host.Reflect.construct(target, args));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.get = (target, property) =>
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
        return this.Contextify(host.Reflect.get(target, property));
        // return Contextify(target[property]);
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.getOwnPropertyDescriptor = (target, property) =>
    {
      // host.console.log("~OBJECT~ getOwnPropertyDescriptor?", property);
      try
      {
        return this.Contextify(host.Reflect.getOwnPropertyDescriptor(target, property));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.has = (target, property) =>
    {
      try
      {
        return this.Contextify(host.Reflect.has(target, property));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.set = (target, property, value) =>
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

    handler.getPrototypeOf = (target) =>
    {
      // host.console.log("~OBJECT~ getPrototypeOf");
      // return Object.prototype;
      return host.Reflect.getPrototypeOf(target);
    }

    handler.setPrototypeOf = (target) =>
    {
      // host.console.log("~OBJECT~ setPrototypeOf");
      throw new Error(`Sandboxed code cannot invoke setPrototypeOf on a Proxy object`);
    }

    handler.isExtensible = (target) =>
    {
      // host.console.log("~OBJECT~ isExtensible");
      try
      {
        return this.Contextify(host.Reflect.isExtensible(target));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.preventExtensions = (target) =>
    {
      host.console.log("~OBJECT~ preventExtensions");
      try
      {
        return this.Contextify(host.Reflect.preventExtensions(target));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.ownKeys = (target) =>
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
        return this.Contextify(keys);
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    handler.enumerate = (target) =>
    {
      // host.console.log("~OBJECT~ enumerate");
      try
      {
        return this.Contextify(host.Reflect.enumerate(target));
      }
      catch (error)
      {
        throw this.Contextify(error);
      }
    }

    // const proxy = new host.Proxy(createBaseObject(value), handler);
    const proxy = new host.Proxy(value, handler);

    const proxies = this.GetProxies();
    proxies.set(value, proxy);

    return proxy;
  }

  Contextify(value)
  {
    const proxies = this.GetProxies();
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
      default: throw new Error(`Cannot Contextify unknown object type "${typeof(value)}"`);
    }
  }

  CloneBoolean(value)
  {
    if (value === true) return true;
    else return false;
  }

  CloneNumber(value)
  {
    if (value instanceof Number) return value;
    else return Number(value);
  }

  CloneString(value)
  {
    if (value instanceof String) return value;
    else return String(value);
  }

  CloneSymbol(value)
  {
    if (value instanceof Symbol) return value;
    else return Symbol(value.description);
  }

  CloneObject(value)
  {
    if (value instanceof Object) return value;

    const clone = {};

    return clone;
  }

  Clone(value)
  {
    const clones = this.GetClones();
    if (clones.has(value)) return clones.get(value);

    switch (typeof(value))
    {
      case "undefined": return undefined;
      case "boolean": return this.CloneBoolean(value);
      case "number": return this.CloneNumber(value);
      case "string": return this.CloneString(value);
      case "symbol": return this.CloneSymbol(value);
      case "function": return this.CloneFunction(value);
      case "object": return this.CloneObject(value);
      default: throw new Error(`Cannot Contextify unknown object type "${typeof(value)}"`);
    }
  }

  Activate(name)
  {
    try
    {
      this.GetVM().Activate(name);
    }
    catch (error)
    {
      throw this.Contextify(error);
    }
  }

  Deactivate(name)
  {
    try
    {
      this.GetVM().Deactivate(name);
    }
    catch (error)
    {
      throw this.Contextify(error);
    }
  }

  GetVM(){ return this.vm; }
  GetName(){ return this.GetVM().GetName(); }
  GetHost(){ return this.GetVM().GetHost(); }
  // GetContext(){ return this.GetVM().GetContext(); }
  GetContext(){ return globalThis; }
  GetProxies(){ return this.proxies; }
}

export default function(context, vm)
{
  return new Sandbox(context, vm);
}
