import {Tag} from "/js/Tag.js";
import {DT} from "/js/Tags/DT.js";
import {DD} from "/js/Tags/DD.js";

export class DL extends Tag
{
  static GetLocalName(){ return "dl"; }
  static GetMetaURL(){ return import.meta.url; }

  static From(...args){ return new this().From(...args); }

  From(object, wrap_ctor)
  {
    for (const key in object)
    {
      if (!object.hasOwnProperty(key)) continue;

      const value = object[key];

      this.Add(
        new DT().Add(wrap_ctor ? new wrap_ctor().Add(key) : key),
        new DD().Add(value),
      );
    }

    return this;
  }
}
