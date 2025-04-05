import "/flag#dangerous";

const OBJECT_PROTOTYPE = Reflect.getPrototypeOf(Object);
const CLONED = new WeakMap();
const INSTANCES = new WeakMap();

export class Clone
{
  static CloneDescriptor(source, target, key, descriptor)
  {
    const enumerable = descriptor.enumerable;

    if (Object.hasOwn(descriptor, "get"))
    {
      Reflect.defineProperty(target, key, {
        configurable: false,
        enumerable,
        get: () =>
        {
          return this.Get(descriptor.get());
        },
        // set: value.set,
      });
    }
    else
    {
      // console.log("Cloning", descriptor);
      Reflect.defineProperty(target, key, {
        value: this.Get(descriptor.value),
        writable: false,
        configurable: false,
        enumerable,
      });
    }
  }

  static CloneProperty(source, target, key)
  {
    const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
    return this.CloneDescriptor(source, target, key, descriptor);
  }

  static CloneProperties(source, target)
  {
    for (const key of Reflect.ownKeys(source))
    {
      if (key === "prototype")
      {
        // console.log("~~Skipping prototype");
        continue;
      }

      this.CloneProperty(source, target, key);
    }
  }

  static GetClass(source)
  {
    const parent = Reflect.getPrototypeOf(source);

    const name = source.name;
    let wrapper;

    if (parent && parent !== OBJECT_PROTOTYPE)
    {
      console.log("Cloning class", source, parent);

      wrapper = {
        [name]: class extends Clone(parent)
        {
          constructor(...args)
          {
            super(...args);
            console.log("Derived cloned constructor!", name);
          }
        },
      };
    }
    else
    {
      wrapper = {
        [name]: class
        {
          constructor(...args)
          {
            console.log("Cloned constructor!", name);
            INSTANCES.set(this, new source(...args));
          }
        },
      };
    }

    const target = wrapper[name];

    CLONED.set(source, target);

    this.CloneProperties(source.prototype, target.prototype);
    this.CloneProperties(source, target);

    return target;
  }

  static GetFunction(source)
  {
    if (source !== Object && source.prototype instanceof Object)
    {
      return this.GetClass(source);
    }
    else
    {
      const self = this;
      const name = source.name;
      const wrapper = {
        [name]: function(...args)
        {
          const instance = INSTANCES.get(this);
          return self.Get(source.apply(instance, args));
        },
      };

      const target = wrapper[name];
      CLONED.set(source, target);

      return target;
    }
  }

  static GetObject(source)
  {
    if (source === null) return this.GetNull(source);

    const target = {};

    CLONED.set(source, target);

    this.CloneProperties(source, target);

    return target;
  }

  static GetNumber(source){ return source; }
  static GetString(source){ return source; }
  static GetSymbol(source){ return source; }
  static GetBoolean(source){ return source; }
  static GetUndefined(source){ return undefined; }
  static GetNull(source){ return null; }

  static Get(source)
  {
    if (CLONED.has(source)) return CLONED.get(source);

    switch (typeof(source))
    {
      case "object": return this.GetObject(source);
      case "function": return this.GetFunction(source);
      case "number": return this.GetNumber(source);
      case "string": return this.GetString(source);
      case "symbol": return this.GetSymbol(source);
      case "boolean": return this.GetBoolean(source);
      case "undefined": return this.GetUndefined(source);
      {
        return source;
      }
      default:
      {
        console.log("Unknown type", typeof(source));
      }
    }
  }
}
