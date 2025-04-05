import {Tag} from "/js/Tag.js";
import {Model} from "/js/Tags/Model.js";

export class Actions extends Model
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "action"; }

  static Seed(collection)
  {
    collection.CreateIndexes({
      path: 1,
    });

    return super.Seed(collection);
  }

  Path(o, v){ return this.SetString("path", o, v); }
  Actions(v, o){ return this.SetArray("actions", v, o); }

  Apply(action, args)
  {
    switch (action)
    {
      case "path": return this.Path(...args);
      case "actions": return this.Actions(...args);
      default: return super.Apply(action, args);
    }
  }
}
