const url = new global.URL(import.meta.url);
const site = url.searchParams.get("site");

// global.Object.seal(global.String);

// global.console.log(global.process);

global.console.log(url.href);

// global.Function.prototype.constructor = undefined;
// global.Object.setDescriptor(global.Function.prototype, "constructor", {
//   get()
//   {
//
//   },
// });

function Activate()
{

}

export function setTimeout(fn, delay, ...args)
{
  return global.setTimeout(function setTimeoutSandboxWrapper(...args)
  {
    Activate();
    return fn(...args);
  }, delay, ...args);
}

export function setInterval(fn, delay, ...args)
{
  return global.setInterval(function setIntervalSandboxWrapper(...args)
  {
    Activate();
    return fn(...args);
  }, delay, ...args);
}

export function setImmediate(fn)
{
  return global.setImmediate(function setImmediateSandboxWrapper()
  {
    Activate();
    return fn();
  });
}

export function queueMicrotask(fn)
{
  return global.queueMicrotask(function queueMicrotaskSandboxWrapper()
  {
    Activate();
    return fn();
  });
}

export function clearTimeout(object)
{
  return global.clearTimeout(object);
}

export function clearInterval(object)
{
  return global.clearInterval(object);
}

export function clearImmediate(object)
{
  return global.clearImmediate(object);
}

export const console = {
  log(...args){ return global.console.log.apply(global.console, args); },
  warn(...args){ return global.console.warn.apply(global.console, args); },
  error(...args){ return global.console.error.apply(global.console, args); },
};

class Process
{
  IllegalCall(name){ throw new Error(`A sandboxed module is not allowed to call process.${name}`); }

  cwd(){ return this.IllegalCall(`cwd`); }
  disconnect(){ return this.IllegalCall(`disconnect`); }
  hrtime(){ return this.IllegalCall(`hrtime`); }
  binding(){ return this.IllegalCall(`binding`); }
  dlopen(){ return this.IllegalCall(`dlopen`); }
  uptime(){ return this.IllegalCall(`uptime`); }
  cpuUsage(){ return this.IllegalCall(`cpuUsage`); }
  resourceUsage(){ return this.IllegalCall(`resourceUsage`); }
  memoryUsage(){ return this.IllegalCall(`memoryUsage`); }
  kill(){ return this.IllegalCall(`kill`); }
  exit(){ return this.IllegalCall(`exit`); }
  abort(){ return this.IllegalCall(`abort`); }
  send(){ return this.IllegalCall(`send`); }
  setegid(){ return this.IllegalCall(`setegid`); }
  seteuid(){ return this.IllegalCall(`seteuid`); }
  setgid(){ return this.IllegalCall(`setgid`); }
  setuid(){ return this.IllegalCall(`setuid`); }
  setgroups(){ return this.IllegalCall(`setgroups`); }
  setUncaughtExceptionCaptureCallback(){ return this.IllegalCall(`setUncaughtExceptionCaptureCallback`); }
  umask(){ return this.IllegalCall(`umask`); }

  nextTick(callback, ...args)
  {
    return global.process.nextTick(function nextTickSandboxWrapper()
    {
      Activate();
      return callback(...args);
    });
  }

  get version(){ return global.process.version; }
  get connected(){ return global.process.connected; }
  get arch(){ return global.process.arch; }
  get platform(){ return global.process.platform; }
}

export const process = new Process();

export class Function extends global.Function
{
  constructor()
  {
    throw new Error(`A sandboxed module is not allowed to call the function constructor`);
    // super();
  }
}

// export class Object extends global.Object
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Array extends global.Array
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Set extends global.Set
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Map extends global.Map
// {
//   static get constructor()
//   {
//   }
// }
//
// export class WeakSet extends global.WeakSet
// {
//   static get constructor()
//   {
//   }
// }
//
// export class WeakMap extends global.WeakMap
// {
//   static get constructor()
//   {
//   }
// }
//
// export class String extends global.String
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Number extends global.Number
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Boolean extends global.Boolean
// {
//   static get constructor(){ throw new Error(`Cannot `); }
// }
//
// export class Symbol extends global.Symbol
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Date extends global.Date
// {
//   static get constructor()
//   {
//   }
// }

// export class Math extends global.Math
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Reflect extends global.Reflect
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Error extends global.Error
// {
//   static get constructor()
//   {
//   }
// }
//
// export class Buffer extends global.Buffer
// {
//   static get constructor()
//   {
//   }
// }

const pseudo_global = {
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval,
  clearImmediate,
  console,
  process,
  Function,
};

// Add the circular reference
pseudo_global.global = pseudo_global;

export {pseudo_global as global};
