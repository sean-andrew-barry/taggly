import {Tag} from "/js/Tag.js";
import {Model} from "/js/Tags/Model.js";

export class Secret extends Model
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "secret"; }

  Key(o, v){ return this.SetString("key", o, v); }
  Value(o, v){ return this.SetString("value", o, v); }
  Expiration(o, v){ return this.SetDate("expiration", o, v); }

  GetKey(){ return this.key; }
  GetValue(){ return this.value; }
  GetExpiration(){ return this.expiration; }

  Apply(action, args)
  {
    switch (action)
    {
      case "key": return this.Key(...args);
      case "value": return this.Value(...args);
      case "expiration": return this.Expiration(...args);
      default: return super.Apply(action, args);
    }
  }
}
