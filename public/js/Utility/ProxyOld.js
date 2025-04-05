export class Proxy
{
  constructor(target)
  {
    return new global.Proxy(target, {
      construct: this.OnConstruct.bind(this),
      getPrototypeOf: this.OnGetPrototypeOf.bind(this),
      setPrototypeOf: this.OnSetPrototypeOf.bind(this),
      isExtensible: this.OnIsExtensible.bind(this),
      preventExtensions: this.OnPreventExtensions.bind(this),
      apply: this.OnApply.bind(this),
      has: this.OnHas.bind(this),
      get: this.OnGet.bind(this),
      set: this.OnSet.bind(this),
      deleteProperty: this.OnDelete.bind(this),
      enumerate: this.OnEnumerate.bind(this),
      ownKeys: this.OnOwnKeys.bind(this),
      defineProperty: this.OnDefineProperty.bind(this),
      getOwnPropertyDescriptor: this.OnGetOwnPropertyDescriptor.bind(this),
    });
  }

  OnConstruct(target, args, new_target)
  {
    return Reflect.construct(target, args);
  }

  OnGetPrototypeOf(target)
  {
    return Reflect.getPrototypeOf(target);
  }

  OnSetPrototypeOf(target, prototype)
  {
    return Reflect.setPrototypeOf(target, prototype);
  }

  OnIsExtensible(target)
  {
    return Reflect.isExtensible(target);
  }

  OnPreventExtensions(target)
  {
    return Reflect.preventExtensions(target);
  }

  OnApply(target, self, args)
  {
    return Reflect.apply(target, self, args);
  }

  OnHas(target, key)
  {
    return Reflect.has(target, key);
  }

  OnGet(target, key)
  {
    return Reflect.get(target, key);
  }

  OnSet(target, key, value)
  {
    return Reflect.set(target, key, value);
  }

  OnDelete(target, key)
  {
    return Reflect.delete(target, key);
  }

  OnEnumerate(target, key)
  {
    return target.keys();
  }

  OnOwnKeys(target, key)
  {
    return target.keys();
  }

  OnDefineProperty(target, key, desc)
  {
    if (desc && "value" in desc)
    {
      target.setItem(key, desc.value);
    }

    return target;
  }

  OnGetOwnPropertyDescriptor(target, key)
  {
    const value = target.getItem(key);
    return value ? {
      value,
      writable: true,
      enumerable: true,
      configurable: false
    } : undefined;
  }
}
