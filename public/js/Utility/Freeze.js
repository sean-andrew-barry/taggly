import "/flag#frozen";
import "/flag#dangerous";

const OBJECT = globalThis.Object;
const FROZEN = new WeakSet();

function FreezeHelper(object)
{
  if (FROZEN.has(object)) return false; // Already done
  else FROZEN.add(object);

  // console.log("Freezing", object);

  // OBJECT.preventExtensions(object);
  // OBJECT.seal(object);
  // console.log("Freezing", object);
  OBJECT.freeze(object);
  return true;
}

function _FreezeDescriptor(object, key, value)
{
  if (value.configurable === true || value.writable === true)
  {
    if (value.hasOwnProperty("get"))
    {
      // console.log("Freezing getter", key, value);

      OBJECT.defineProperty(object, key, {
        configurable: false,
        enumerable: value.enumerable ?? false,
        get: value.get,
        // set: value.set,
      });

      return;
    }
    else
    {
      OBJECT.defineProperty(object, key, {
        configurable: false,
        value: value.value,
        writable: false,
        enumerable: value.enumerable ?? false,
      });

      return Helper(value.value);
    }
  }
  else
  {
    // console.log("Freezing non-configurable", key, value);
  }
}

function FreezeDescriptor(object, key, value)
{
  if (value.hasOwnProperty("get"))
  {
    // console.log("Freezing getter", key, value);

    OBJECT.defineProperty(object, key, {
      configurable: false,
      enumerable: value.enumerable ?? false,
      get: value.get,
      // set: value.set,
    });

    Helper(value.get);
    Helper(value.set);
    return;
  }
  else
  {
    if (value.configurable || value.writable)
    {
      // console.log("Redefining", value);
      OBJECT.defineProperty(object, key, {
        configurable: false,
        value: value.value,
        writable: false,
        enumerable: value.enumerable ?? false,
      });
    }

    try
    {
      return Helper(value.value);
    }
    catch (error)
    {
      console.error("Failed to freeze", key, error);
    }
  }
}

function FreezeProperty(object, key)
{
  const descriptor = OBJECT.getOwnPropertyDescriptor(object, key);
  return FreezeDescriptor(object, key, descriptor);
}

function FreezeProperties(object)
{
  for (const name of OBJECT.getOwnPropertyNames(object))
  {
    FreezeProperty(object, name);
  }

  for (const symbol of OBJECT.getOwnPropertySymbols(object))
  {
    FreezeProperty(object, symbol);
  }
}

function FreezeClass(value)
{
  if (FROZEN.has(value)) return;

  // console.log("Freezing class", value);

  FreezeHelper(value);
  FreezeProperties(value);
  FreezeProperties(value.prototype);
  // TODO: Freeze super class as well?
}

function FreezeFunction(value)
{
  if (FROZEN.has(value)) return;

  if (value !== OBJECT && value.prototype instanceof OBJECT)
  {
    return FreezeClass(value);
  }
  else
  {
    return FreezeHelper(value);
  }
}

function FreezeObject(object)
{
  if (object === null) return;
  if (FROZEN.has(object)) return;
  // if (!Freeze(object)) return;

  // if (!Object.isExtensible(object))
  // {
  //   console.log("Is NOT extensible");
  // }

  FreezeHelper(object);

  // console.log("Freezing", object === global);

  FreezeProperties(object);
}

function Helper(value)
{
  switch (typeof(value))
  {
    case "object": return FreezeObject(value);
    case "function": return FreezeFunction(value);
    case "number":
    case "string":
    case "symbol":
    case "undefined":
    case "boolean":
    {
      return;
    }
    default:
    {
      console.log("Unknown type", typeof(value));
    }
  }
}

export function Freeze(value, name)
{
  if (name === undefined) return Helper(value);
  else return FreezeProperty(value, name);
}
