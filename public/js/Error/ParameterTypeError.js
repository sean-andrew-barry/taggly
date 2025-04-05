import {Error} from "/js/Error.js";

export class ParameterTypeError extends Error
{
  get message()
  {
    return `Expected parameter "${this.GetName()}" to be type "${this.GetType()}", but got type "${typeof(this.GetValue())}"`;
  }
}

// new ParameterTypeError().Name("param1").Type("string");
