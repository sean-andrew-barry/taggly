import console from "/js/Console.js";

const WRAPPED = new WeakMap();
const PROXIES = new WeakSet();

// Store a reference to this so it can't be tricked to using the wrong object
const GlobalProxy = globalThis.Proxy;
const GlobalString = globalThis.String;

export class Proxy
{
  static IsProxied(value){ return WRAPPED.has(value); }
  static IsProxy(value)
  {
    switch (typeof(value))
    {
      case "function": return PROXIES.has(value);
      case "object":
      {
        if (value === null) return true;
        else return PROXIES.has(value);
      }
      default:
      {
        return true;
      }
    }
  }

  // Create a function "class" which has a prototype that is configurable
  // So that it can be inherited from via a proxy
  static Extend(ctor)
  {
    const fn = function()
    {
    }

    fn.prototype = Object.create(ctor.prototype);

    Object.getOwnPropertyNames(ctor).forEach(key =>
    {
      if (key === "length") return;
      if (key === "name") return;
      if (key === "prototype") return;

      // console.log("Copying", key);

      // Object.defineProperty(fn, key, {
      //   value: ctor[key],
      //   enumerable: false,
      //   writable: false,
      // });

      fn[key] = ctor[key];
    });

    Object.getOwnPropertySymbols(ctor).forEach(key =>
    {
      fn[key] = ctor[key];
    });

    // Object.freeze(fn);

    // Object.preventExtensions(fn);

    return new this(fn);
  }

  static Copy(source, target)
  {
    Object.getOwnPropertyNames(source).forEach(key =>
    {
      if (key === "length") return;
      if (key === "name") return;
      if (key === "prototype") return;
      if (key === "constructor") return;

      const value = source[key];

      switch (typeof(value))
      {
        case "function":
        {
          console.log("Hooking", key, value);
          target[key] = function(...args)
          {
            console.log("Hooked", key, args);
            return value.apply(this, ...args);
          }
          break;
        }
        default:
        {
          target[key] = value;
        }
      }
    });

    Object.getOwnPropertySymbols(source).forEach(key =>
    {
      target[key] = source[key];
    });
  }

  static Extend(ctor)
  {
    const fn = function()
    {
    }

    fn.prototype = Object.create(ctor.prototype);
    // fn.prototype = ctor.prototype;
    // fn.prototype = Object.create(Object.getPrototypeOf(ctor));
    // fn.prototype = {};

    // fn.prototype.constructor =

    Object.defineProperty(fn.prototype, "constructor", {
      value: fn,
      enumerable: false, // so that it does not appear in 'for in' loop
      writable: true,
    });

    // Object.getOwnPropertyNames(ctor).forEach(key =>
    // {
    //   if (key === "length") return;
    //   if (key === "name") return;
    //   if (key === "prototype") return;
    //
    //   fn[key] = ctor[key];
    // });
    //
    // Object.getOwnPropertySymbols(ctor).forEach(key =>
    // {
    //   fn[key] = ctor[key];
    // });

    // Object.getOwnPropertyNames(ctor.prototype).forEach(key =>
    // {
    //   if (key === "length") return;
    //   if (key === "name") return;
    //   if (key === "prototype") return;
    //
    //   console.log("Copying", key);
    //
    //   fn.prototype[key] = ctor.prototype[key];
    // });
    //
    // Object.getOwnPropertySymbols(ctor.prototype).forEach(key =>
    // {
    //   fn.prototype[key] = ctor.prototype[key];
    // });

    // Object.freeze(fn);

    Object.preventExtensions(fn);

    return new this(fn);
  }

  static Inherit(ctor, parent)
  {
    const name = ctor.name;

    if (!parent) return { [name]: class {}, }[name];
    else return { [name]: class extends parent {}, }[name];
  }

  static Clone(ctor, parent)
  {
    const clone = this.Inherit(ctor, parent);
    console.log("Cloned", clone);

    this.Copy(ctor, clone);
    this.Copy(ctor.prototype, clone.prototype);

    return clone;
  }

  constructor(value, writable = false)
  {
    this.writable = writable;
    // console.log("Constructing Proxy for", value);

    // const proxy = new GlobalProxy(value, {
    //   construct: this.OnConstruct.bind(this),
    //   getPrototypeOf: this.OnGetPrototypeOf.bind(this),
    //   setPrototypeOf: this.OnSetPrototypeOf.bind(this),
    //   isExtensible: this.OnIsExtensible.bind(this),
    //   preventExtensions: this.OnPreventExtensions.bind(this),
    //   apply: this.OnApply.bind(this),
    //   has: this.OnHas.bind(this),
    //   get: this.OnGet.bind(this),
    //   set: this.OnSet.bind(this),
    //   deleteProperty: this.OnDelete.bind(this),
    //   enumerate: this.OnEnumerate.bind(this),
    //   ownKeys: this.OnOwnKeys.bind(this),
    //   defineProperty: this.OnDefineProperty.bind(this),
    //   getOwnPropertyDescriptor: this.OnGetOwnPropertyDescriptor.bind(this),
    // });

    const proxy = new GlobalProxy(value, this);

    WRAPPED.set(value, proxy); // Map the value to the proxy
    WRAPPED.set(proxy, proxy);
    PROXIES.add(proxy); // Map the proxy to itself

    return proxy;
  }

  apply(...args){ return this.OnApply(...args); }
  construct(...args){ return this.OnConstruct(...args); }
  defineProperty(...args){ return this.OnDefineProperty(...args); }
  deleteProperty(...args){ return this.OnDelete(...args); }
  get(...args){ return this.OnGet(...args); }
  getPrototypeOf(...args){ return this.OnGetPrototypeOf(...args); }
  setPrototypeOf(...args){ return this.OnSetPrototypeOf(...args); }
  isExtensible(...args){ return this.OnIsExtensible(...args); }
  preventExtensions(...args){ return this.OnPreventExtensions(...args); }
  has(...args){ return this.OnHas(...args); }
  set(...args){ return this.OnSet(...args); }
  ownKeys(...args){ return this.OnOwnKeys(...args); }
  getOwnPropertyDescriptor(...args){ return this.OnGetOwnPropertyDescriptor(...args); }

  WrapUndefined(value){ return value; }
  WrapBoolean(value){ return value; }
  WrapNumber(value){ return value; }
  WrapString(value){ return value; }
  WrapSymbol(value){ return value; }
  WrapNull(value){ return value; }

  WrapFunction(value)
  {
    return this.WrapObject(value);
  }

  WrapObject(value)
  {
    if (value === null) return this.WrapNull(value);

    const proxy = new this.constructor(value, this.writable);
    // console.log("New proxy for", value, proxy);

    // WRAPPED.set(value, proxy);

    return proxy;
  }

  WrapUnknown(value)
  {
    throw this.Wrap(new Error(`Unknown type "${typeof(value)}"`));
  }

  Wrap(value)
  {
    if (PROXIES.has(value))
    {
      console.log("Already proxied");
      return value;
    }

    if (WRAPPED.has(value))
    {
      console.log("Already wrapped", value);
      return WRAPPED.get(value);
    }

    switch (typeof(value))
    {
      case "undefined": return this.WrapUndefined(value);
      case "boolean": return this.WrapBoolean(value);
      case "number": return this.WrapNumber(value);
      case "string": return this.WrapString(value);
      case "symbol": return this.WrapSymbol(value);
      case "function": return this.WrapFunction(value);
      case "object": return this.WrapObject(value);
      default: return this.WrapUnknown(value);
    }
  }

  construct(target, args, new_target)
  {
    console.log("Proxy.construct");
    return this.Wrap(Reflect.construct(target, args, new_target));
  }

  getPrototypeOf(target)
  {
    console.log("Proxy.getPrototypeOf");
    // return Reflect.getPrototypeOf(target);
    return this.Wrap(Reflect.getPrototypeOf(target));
    // return this.Wrap(target.prototype);
  }

  setPrototypeOf(target, prototype)
  {
    console.log("Proxy.setPrototypeOf");

    if (this.writable) return this.Wrap(Reflect.setPrototypeOf(target, prototype));
    else throw new Error(`Proxy cannot setPrototypeOf "${target}" because it is read-only`);
  }

  isExtensible(target)
  {
    console.log("Proxy.isExtensible");
    return this.Wrap(Reflect.isExtensible(target));
  }

  preventExtensions(target)
  {
    console.log("Proxy.preventExtensions");

    if (this.writable) return this.Wrap(Reflect.preventExtensions(target));
    else throw new Error(`Proxy cannot preventExtensions on "${target}" because it is read-only`);
  }

  apply(target, self, args)
  {
    console.log("Proxy.apply", self, args);
    return this.Wrap(Reflect.apply(target, self, args));
  }

  has(target, key)
  {
    console.log("Proxy.has", key);
    return this.Wrap(Reflect.has(target, key));
  }

  OnGet(target, key)
  {
    // console.log("Proxy.OnGet", key);
    switch (key)
    {
      case "prototype":
      {
        const proto = Reflect.get(target, key);
        const proxy = this.Wrap(proto);
        const real = Object.getPrototypeOf(target);

        console.log("Proxy.OnGet", this.constructor.IsProxy(target), key, proto, proxy, real);

        // let temp;
        // temp = this.CreateTemp(target);
        //
        // console.log("Temp:", temp);

        // return Reflect.get(temp, key);
        // return proto;
        return proxy;
        // return new globalThis.Proxy(proto, {});
      }
      default: return this.Wrap(Reflect.get(target, key));
    }
  }

  get(target, key)
  {
    console.log("Proxy.get", key);
    // return Reflect.get(target, key);
    // return this.Wrap(target[key]);
    return this.Wrap(Reflect.get(target, key));
  }

  set(target, key, value, receiver)
  {
    console.log("Proxy.set", key, value);

    if (this.writable) return this.Wrap(Reflect.set(target, key, value, receiver));
    else throw new Error(`Proxy cannot set "${key}" to "${value}" because it is read-only`);
  }

  deleteProperty(target, key)
  {
    console.log("Proxy.deleteProperty", key);

    if (this.writable) return this.Wrap(Reflect.deleteProperty(target, key));
    else throw new Error(`Proxy cannot delete property "${key}" because it is read-only`);
  }

  ownKeys(target)
  {
    console.log("Proxy.ownKeys");

    return this.Wrap(Reflect.ownKeys(target));
  }

  defineProperty(target, key, desc)
  {
    console.log("Proxy.defineProperty", key);

    if (this.writable) return this.Wrap(Reflect.defineProperty(target, key, desc));
    else throw new Error(`Proxy cannot defineProperty "${key}" because it is read-only`);
  }

  getOwnPropertyDescriptor(target, key)
  {
    console.log("Proxy.getOwnPropertyDescriptor", key);
    return Reflect.getOwnPropertyDescriptor(target, key);
    // return this.Wrap(Reflect.getOwnPropertyDescriptor(target, key));
    // return {
    //   value: target[key],
    //   configurable: true,
    //   enumerable: true,
    // };
  }
}
