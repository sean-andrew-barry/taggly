function Contextifier(options)
{
  "use strict";

  const {
    host,
    name,
    url,
    path,
    Module,
    FS,
    VM,
    Path,
    trusted = false,
    commonjs = false,
    vm,
    activate,
    deactivate,
    loader,
    context,
  } = options;

  // This is critical for security, otherwise the sandbox can be escaped using global.constructor
  // It is needed because the context object (the global) cannot be created in its own context
  Object.setPrototypeOf(this, Object.prototype);

  const global = globalThis;
  globalThis.global = globalThis;

  const proxies = new WeakMap();
  const values = new WeakMap();

  function ContextifyBoolean(value)
  {
    if (!!value) return true;
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
      // return value;
      return Symbol(value.description);
    }
  }

  function ContextifyFunction(value)
  {
    if (value instanceof Function) return value; // Already in context

    // host.console.log("Contextifying function", value);

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
    values.set(proxy, value);
    return proxy;
  }

  function ContextifyArrayBuffer(value)
  {
    if (value instanceof ArrayBuffer) return value; // Already in context

    const buffer = new ArrayBuffer(value.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(value));

    return buffer;
  }

  function ContextifyTypedArrayHelper(value, type)
  {
    if (value instanceof type) return value; // Already in context

    const buffer = ContextifyArrayBuffer(Decontextify(value.buffer));
    const array = new type(buffer);

    return array;
  }

  function ContextifyBigUint64Array(value){ return ContextifyTypedArrayHelper(value, BigUint64Array); }
  function ContextifyBigInt64Array(value){ return ContextifyTypedArrayHelper(value, BigInt64Array); }
  function ContextifyFloat64Array(value){ return ContextifyTypedArrayHelper(value, Float64Array); }
  function ContextifyFloat32Array(value){ return ContextifyTypedArrayHelper(value, Float32Array); }
  function ContextifyUint32Array(value){ return ContextifyTypedArrayHelper(value, Uint32Array); }
  function ContextifyInt32Array(value){ return ContextifyTypedArrayHelper(value, Int32Array); }
  function ContextifyUint16Array(value){ return ContextifyTypedArrayHelper(value, Uint16Array); }
  function ContextifyInt16Array(value){ return ContextifyTypedArrayHelper(value, Int16Array); }
  function ContextifyUintClamped8Array(value){ return ContextifyTypedArrayHelper(value, Uint8ClampedArray); }
  function ContextifyUint8Array(value){ return ContextifyTypedArrayHelper(value, Uint8Array); }
  function ContextifyInt8Array(value){ return ContextifyTypedArrayHelper(value, Int8Array); }

  // TODO: This currently completely avoids contextifying at all
  function ContextifyBuffer(value)
  {
    if (!trusted)
    {
      throw new Error(`Cannot use Node.js Buffer in an untrusted context`);
    }

    // console.log("Contextifying Buffer");
    // value = Decontextify(value);
    // const array_buffer = ContextifyArrayBuffer(value.buffer);
    // const buffer = Buffer.from(value);
    //
    // return buffer;

    return value;

    // // const array = new Uint8Array(value);
    //
    // return array;
  }

  function ContextifyArray(value)
  {
    if (value instanceof Array) return value; // Already in context

    const array = [];
    for (const item of value)
    {
      array.push(Contextify(item));
    }

    return array;
  }

  function ContextifyFunctionObject(value)
  {
    if (value instanceof Object) return value; // Already in context

    const object = Object.create(null);
    for (const key of Object.keys(value))
    {
      object[Contextify(key)] = Contextify(value[key]);
    }

    return object;
  }

  function ContextifyPlainObject(value)
  {
    if (value instanceof Object) return value; // Already in context

    const object = {};
    for (const key of Object.keys(value))
    {
      object[Contextify(key)] = Contextify(value[key]);
    }

    return object;
  }

  function ContextifyMap(value)
  {
    const map = new Map();
    for (const [k, v] of value)
    {
      map.set(Contextify(k), Contextify(v));
    }

    return map;
  }

  function ContextifySet(value)
  {
    const set = new Set();
    for (const v of value)
    {
      set.add(Contextify(v));
    }

    return set;
  }

  function ContextifyObjectByConstructor(value)
  {
    switch (value.constructor)
    {
      case host.ArrayBuffer: return ContextifyArrayBuffer(value);
      case host.BigUint64Array: return ContextifyBigUint64Array(value);
      case host.BigInt64Array: return ContextifyBigInt64Array(value);
      case host.Float64Array: return ContextifyFloat64Array(value);
      case host.Float32Array: return ContextifyFloat32Array(value);
      case host.Uint32Array: return ContextifyUint32Array(value);
      case host.Int32Array: return ContextifyInt32Array(value);
      case host.Uint16Array: return ContextifyUint16Array(value);
      case host.Int16Array: return ContextifyInt16Array(value);
      case host.Uint8ClampedArray: return ContextifyUint8ClampedArray(value);
      case host.Uint8Array: return ContextifyUint8Array(value);
      case host.Int8Array: return ContextifyInt8Array(value);
      case host.Array: return ContextifyArray(value);
      case host.Object: return ContextifyPlainObject(value);
      case host.Function: return ContextifyFunctionObject(value);
      case host.Map: return ContextifyMap(value);
      case host.Set: return ContextifySet(value);
      case host.Buffer: return ContextifyBuffer(value); // TODO: These are problematic and currently not contextified
      default:
      {
        // console.log("Contextifying unknown", value.constructor);
      }
    }
  }

  function ContextifyObject(value)
  {
    if (value === null) return null;
    if (value instanceof Object) return value; // Already in context

    const result = ContextifyObjectByConstructor(value);
    if (result)
    {
      proxies.set(value, result);
      values.set(result, value);

      return result;
    }

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
        // host.console.log("Get", property, target);
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
      console.error(target, property, value);
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

      try
      {
        return Contextify(host.Reflect.getPrototypeOf(target));
      }
      catch (error)
      {
        throw Contextify(error);
      }
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
        return Contextify(host.Reflect.ownKeys(target));
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
    values.set(proxy, value);
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

  function Decontextify(value)
  {
    return values.get(value) ?? value;
  }

  const C = Contextify; // Short version

  if (trusted && commonjs)
  {
    global.Blob = C(host.Blob);
    global.Buffer = C(host.Buffer);
    global.CompressionStream = C(host.CompressionStream);
    global.CountQueuingStrategy = C(host.CountQueuingStrategy);
    global.Crypto = C(host.Crypto);
    global.crypto = C(host.crypto);
    global.CryptoKey = C(host.CryptoKey);
    global.CustomEvent = C(host.CustomEvent);
    global.Event = C(host.Event);
    global.EventTarget = C(host.EventTarget);
    global.FormData = C(host.FormData);
    global.Headers = C(host.Headers);
    global.MessageChannel = C(host.MessageChannel);
    global.MessageEvent = C(host.MessageEvent);
    global.MessagePort = C(host.MessagePort);
    global.PerformanceEntry = C(host.PerformanceEntry);
    global.PerformanceMark = C(host.PerformanceMark);
    global.PerformanceMeasure = C(host.PerformanceMeasure);
    global.PerformanceObserver = C(host.PerformanceObserver);
    global.PerformanceObserverEntryList = C(host.PerformanceObserverEntryList);
    global.PerformanceResourceTiming = C(host.PerformanceResourceTiming);
    global.ReadableByteStreamController = C(host.ReadableByteStreamController);
    global.ReadableStream = C(host.ReadableStream);
    global.ReadableStreamBYOBReader = C(host.ReadableStreamBYOBReader);
    global.ReadableStreamBYOBRequest = C(host.ReadableStreamBYOBRequest);
    global.ReadableStreamDefaultController = C(host.ReadableStreamDefaultController);
    global.ReadableStreamDefaultReader = C(host.ReadableStreamDefaultReader);
    global.Response = C(host.Response);
    global.Request = C(host.Request);
    global.SubtleCrypto = C(host.SubtleCrypto);
    global.DOMException = C(host.DOMException);
    global.TextEncoderStream = C(host.TextEncoderStream);
    global.TransformStream = C(host.TransformStream);
    global.TransformStreamDefaultController = C(host.TransformStreamDefaultController);
    global.WebAssembly = C(host.WebAssembly);
    global.WritableStream = C(host.WritableStream);
    global.WritableStreamDefaultController = C(host.WritableStreamDefaultController);
    global.WritableStreamDefaultWriter = C(host.WritableStreamDefaultWriter);
  }

  global.URL = C(host.URL);
  global.URLSearchParams = C(host.URLSearchParams);
  global.TextEncoder = C(host.TextEncoder);
  global.TextDecoder = C(host.TextDecoder);

  const n = `[${name}]`;
  global.console = {
    log(...args){ args.unshift(n); return C(host.console.log.apply(host.console, args)); },
    debug(...args){ args.unshift(n); return C(host.console.debug.apply(host.console, args)); },
    info(...args){ args.unshift(n); return C(host.console.info.apply(host.console, args)); },
    warn(...args){ args.unshift(n); return C(host.console.warn.apply(host.console, args)); },
    error(...args){ args.unshift(n); return C(host.console.error.apply(host.console, args)); },
    dir(...args){ args.unshift(n); return C(host.console.dir.apply(host.console, args)); },
    time(...args){},
    timeEnd(...args){},
    trace(...args){ return C(host.console.trace.apply(host.console, args)); },
  };

  global.performance = {
    now(...args){ return C(host.performance.now.apply(host.performance.now, args)); }
  };

  function Activate(name)
  {
    try
    {
      if (activate) activate(name);
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
      if (deactivate) deactivate(name);
    }
    catch (error)
    {
      throw Contextify(error);
    }
  }

  // QUESTION: How should I handle Activate and Deactivate with promises?
  global.fetch = async function fetch(...args)
  {
    if (trusted)
    {
      try
      {
        const result = await host.fetch(...args);
        return C(result);
      }
      catch (error)
      {
        throw C(error);
      }
    }
    else
    {
      throw new Error(`Global function "fetch" is not available in an untrusted virtual context`);
    }
  }

  global.setTimeout = function(callback, delay, ...args)
  {
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
    return C(host.setInterval(() =>
    {
      try
      {
        Activate("setInterval");
        return callback(...args);
      }
      catch (error)
      {
        throw C(error);
      }
      finally
      {
        Deactivate("setInterval");
      }
    }, delay));
  }

  global.setImmediate = function(callback)
  {
    return C(host.setImmediate(() =>
    {
      try
      {
        Activate("setImmediate");
        return callback();
      }
      catch (error)
      {
        throw C(error);
      }
      finally
      {
        Deactivate("setImmediate");
      }
    }));
  }

  global.queueMicrotask = function(callback)
  {
    return C(host.queueMicrotask(() =>
    {
      try
      {
        Activate("queueMicrotask");
        return callback();
      }
      catch (error)
      {
        throw C(error);
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
      return C(host.clearTimeout(Decontextify(value)));
    }
    catch (error)
    {
      console.log("~~Clearing timeout error...");
      throw C(error);
    }
  }

  global.clearInterval = function(value)
  {
    try
    {
      return C(host.clearInterval(Decontextify(value)));
    }
    catch (error)
    {
      throw C(error);
    }
  }

  global.clearImmediate = function(value)
  {
    try
    {
      return C(host.clearImmediate(Decontextify(value)));
    }
    catch (error)
    {
      throw C(error);
    }
  }

  global.process = {
    version: C(host.process.version),
    versions: C(host.process.versions),
    connected: C(host.process.connected),
    pid: C(host.process.pid),
    arch: C(host.process.arch), // String, CPU architecture that Node was compiled for, like "arm", "x64"
    platform: C(host.process.platform), // String, like "win32" or "linux"
    noDeprecation: C(host.process.noDeprecation), // Boolean, if the --no-depreciation flag is set

    get argv(){ return trusted ? C(host.process.argv) : []; },
    get argv0(){ return trusted ? C(host.process.argv0) : []; },
    get channel(){ return trusted ? C(host.process.channel) : undefined; }, // If the process has an IPC channel
    get config(){ return trusted ? C(host.process.config) : undefined; },
    get debugPort(){ return trusted ? C(host.process.debugPort) : undefined; },
    get env(){ return trusted ? C(host.process.env) : undefined; },
    get stderr(){ return trusted ? C(host.process.stderr) : undefined; },
    get stdin(){ return trusted ? C(host.process.stdin) : undefined; },
    get stdout(){ return trusted ? C(host.process.stdout) : undefined; },

    get allowedNodeEnvironmentFlags()
    {
      console.log("Get allowedNodeEnvironmentFlags");
      return C(host.process.allowedNodeEnvironmentFlags);
    },

    get debugPort(){ console.log("process.debugPort"); return C(host.process.debugPort); },
    // get env(){ console.log("process.env", host.process.env); return C(host.process.env); },
    get execArgv(){ console.log("process.execArgv"); return C(host.process.execArgv); },
    get execPath(){ console.log("process.execPath"); return C(host.process.execPath); },
    get exitCode(){ console.log("process.exitCode"); return C(host.process.exitCode); },
    // get pid(){ console.log("process.pid"); return C(host.process.pid); },
    get ppid(){ console.log("process.ppid"); return C(host.process.ppid); },
    get release(){ console.log("process.release"); return C(host.process.release); },
    get throwDeprecation(){ console.log("process.throwDeprecation"); return C(host.process.throwDeprecation); },
    get title(){ console.log("process.title"); return C(host.process.title); },
    get traceDeprecation(){ console.log("process.traceDeprecation"); return C(host.process.traceDeprecation); },

    on(...args)
    {
      console.log("process.on", args);
      return C(host.process.on(...args));
    },

    nextTick(callback, ...args)
    {
      return C(host.process.nextTick(() =>
      {
        try
        {
          Activate("nextTick");
          return callback(...args);
        }
        catch (error)
        {
          throw C(error);
        }
        finally
        {
          Deactivate("nextTick");
        }
      }));
    },

    emitWarning(...args){ return C(host.process.emitWarning(...args)); },
    getActiveResourcesInfo(...args){ return C(host.process.getActiveResourcesInfo(...args)); },
    getegid(...args){ return C(host.process.getegid(...args)); },
    geteuid(...args){ return C(host.process.geteuid(...args)); },
    getgid(...args){ return C(host.process.getgid(...args)); },
    getgroups(...args){ return C(host.process.getgroups(...args)); },
    getuid(...args){ return C(host.process.getuid(...args)); },
    hasUncaughtExceptionCaptureCallback(...args){ return C(host.process.hasUncaughtExceptionCaptureCallback(...args)); },
    memoryUsage(...args){ return C(host.process.memoryUsage(...args)); },
    resourceUsage(...args){ return C(host.process.resourceUsage(...args)); },
    setUncaughtExceptionCaptureCallback(...args){ return C(host.process.setUncaughtExceptionCaptureCallback(...args)); },
    umask(...args){ return C(host.process.umask(...args)); },
    uptime(...args){ return C(host.process.uptime(...args)); },

    get report(){ throw new Error(`process.report is disabled in sandboxed code`); },
    abort(...args){ throw new Error(`process.abort is disabled in sandboxed code`); },
    kill(...args){ throw new Error(`process.kill is disabled in sandboxed code`); },
    exit(...args){ throw new Error(`process.exit is disabled in sandboxed code`); },
    disconnect(...args){ throw new Error(`process.disconnect is disabled in sandboxed code`); },
    chdir(...args){ throw new Error(`process.chdir is disabled in sandboxed code`); },
    send(...args){ throw new Error(`process.send is disabled in sandboxed code`); },
    setegid(...args){ throw new Error(`process.setegid is disabled in sandboxed code`); },
    seteuid(...args){ throw new Error(`process.seteuid is disabled in sandboxed code`); },
    setgid(...args){ throw new Error(`process.setgid is disabled in sandboxed code`); },
    setgroups(...args){ throw new Error(`process.setgroups is disabled in sandboxed code`); },
    setuid(...args){ throw new Error(`process.setuid is disabled in sandboxed code`); },
    initgroups(...args){ throw new Error(`process.initgroups is disabled in sandboxed code`); },

    cpuUsage(prev){ return trusted ? C(host.process.cpuUsage(Decontextify(prev))) : undefined; },
    cwd(){ return trusted ? C(host.process.cwd()) : undefined; },

    dlopen(...args)
    {
      if (trusted) return C(host.process.dlopen(...Decontextify(args)));
      else throw new Error(`process.dlopen is disabled in untrusted sandboxed code`);
    },
  };

  global.process.hrtime = function(time)
  {
    return C(host.process.hrtime(time));
  }

  global.process.hrtime.bigint = function()
  {
    return C(host.process.hrtime.bigint());
  }

  const global_then = global.Promise.prototype.then;
  const global_catch = global.Promise.prototype.catch;
  const global_finally = global.Promise.prototype.finally;
  
  global.Promise.prototype.then = function(on_resolve, on_reject)
  {
    // console.log("then");
    if (on_resolve)
    {
      const original_resolve = on_resolve;
      on_resolve = (...args) =>
      {
        try
        {
          Activate("then");
          return original_resolve(...args);
        }
        catch (error)
        {
          throw Contextify(error);
        }
        finally
        {
          Deactivate("then");
        }
      };
    }

    if (on_reject)
    {
      const original_reject = on_reject;
      on_reject = (...args) =>
      {
        try
        {
          Activate("then");
          return original_reject(...args);
        }
        catch (error)
        {
          throw Contextify(error);
        }
        finally
        {
          Deactivate("then");
        }
      };
    }
  
    return global_then.call(this, on_resolve, on_reject);
  };
  
  global.Promise.prototype.catch = function(on_reject)
  {
    // console.log("catch");

    if (on_reject)
    {
      const original_reject = on_reject;
      on_reject = (...args) =>
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
  
    return global_catch.call(this, on_reject);
  };
  
  global.Promise.prototype.finally = function(on_finally)
  {
    if (on_finally)
    {
      const original_finally = on_finally;
      on_finally = (...args) =>
      {
        try
        {
          Activate("finally");
          return original_finally(...args);
        }
        catch (error)
        {
          throw Contextify(error);
        }
        finally
        {
          Deactivate("finally");
        }
      };
    }
  
    return global_finally.call(this, on_finally);
  };

  function CreateRequire(parent, local_name, local_url, local_path)
  {
    local_name ??= name;
    local_url ??= url;
    local_path ??= path;
    
    const node_require = Module.createRequire(parent?.id ?? url);

    function resolve(specifier, options)
    {
      return node_require.resolve(specifier, options);
    }

    function require(specifier)
    {
      const resolved = resolve(specifier);

      if (Module.isBuiltin(resolved) || (!resolved.endsWith(".js") && !resolved.endsWith(".cjs")))
      {
        return node_require(resolved);
      }

      const cached = require.cache[resolved];
      if (cached) return cached.exports;

      const mod = new Module(resolved, parent);

      const filename = resolved;
      const dirname = Path.dirname(filename);
      const new_require = CreateRequire(mod, local_name, local_url, local_path);

      require.cache[resolved] = mod;

      let script;

      try
      {
        const code = FS.readFileSync(resolved).toString();

        script = new VM.Script(`(function(exports, require, module, __filename, __dirname){\n${code}\n})`, {
          filename,
          lineOffset: -1, // Account for the new lines
          columnOffset: 0,
        });
      }
      catch (error)
      {
        console.error(error);
        throw new Error(`Module "${parent?.id}" failed to compile "${specifier}"`, { cause: error });
      }

      try
      {
        const compiled = script.runInContext(context);

        compiled.call(mod, mod.exports, new_require, mod, filename, dirname);
        mod.loaded = true;
      }
      catch (error)
      {
        console.error(error);
        throw new Error(`Module "${parent?.id}" failed when evaluating "${specifier}"`, { cause: error });
      }

      return mod.exports;
    }

    require.resolve = resolve;
    require.main = undefined;
    require.extensions = node_require.extensions;
    require.cache = node_require.cache;

    return require;
  }

  // return CreateRequire();
  return CreateRequire;
}
