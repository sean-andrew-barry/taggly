import {StringUtilities} from "/js/Utility/String.js";

export const STATIC_STRINGS = {};

export class StaticString
{
  static Register(string)
  {
    if (STATIC_STRINGS.hasOwnProperty(string))
    {
      return STATIC_STRINGS[string];
    }

    const code = StringUtilities.Hash16(string);
    if (STATIC_STRINGS.hasOwnProperty(code) && STATIC_STRINGS[code] !== string)
    {
      throw new Error(`Invalid static string "${string}"`);
    }

    const static_string = new StaticString(string, code);

    STATIC_STRINGS[string] = static_string;
    STATIC_STRINGS[code] = static_string;

    return static_string;
  }

  static RegisterAll(array)
  {
    for (let i = 0; i < array.length; i++)
    {
      this.Register(array[i]);
    }
  }

  static RegisterType(type)
  {
    const names = Object.getOwnPropertyNames(type.prototype);

    for (let i = 0; i < names.length; i++)
    {
      const name = StringUtilities.ToSnakeCase(names[i]);
      this.Register(name);
    }
  }

  static Has(value)
  {
    return STATIC_STRINGS.hasOwnProperty(value);
  }

  static Get(value)
  {
    if (STATIC_STRINGS.hasOwnProperty(value))
    {
      return STATIC_STRINGS[value];
    }

    throw new Error(`Unknown static string for value "${value}"`);
  }

  constructor(string, code)
  {
    this.string = string;
    this.code = code;
  }
}
