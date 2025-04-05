import {Tag} from "/js/Tag.js";
import {Model as Base} from "/js/Tags/Model.js?after=/taggly/private/";
import {Collection} from "/js/Tags/Database/Collection.js";
import {Database} from "/js/Tags/Database.js";
import {ObjectID} from "/js/Utility/Database/ObjectID.js";
// import * as Functions from "/js/Functions.js";

const COLLECTION = Symbol("collection");
const FILTER = Symbol("filter");
const UPDATE = Symbol("update");

// try
// {
//   console.log("About to crash!");
//   Int8Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// }
// catch (error)
// {
//   // console.error(error);
//   throw error;
// }
// Int8Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Uint8Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Uint8ClampedArray.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Int16Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Uint16Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Int32Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Uint32Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Float32Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// Float64Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// BigInt64Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }
// BigUint64Array.prototype.toBSON = function toBSON(){ return Buffer.from(this); }

export class Model extends Base
{
  static GetCollectionSymbol(){ return COLLECTION; }
  static GetFilterSymbol(){ return FILTER; }
  static GetUpdateSymbol(){ return UPDATE; }
  static GetCollationSymbol(){ return COLLATION; }
  static GetProjectSymbol(){ return PROJECT; }
  static GetSortSymbol(){ return SORT; }

  static GetDatabase(){ return Tag.GetDocument().GetDatabase(); }

  static async SetCollection(collection)
  {
    if (!collection)
    {
      const database = await this.GetDatabase();
      const name = this.GetCollectionName();

      collection = new Collection(name, await database.GetMongoCollection(name));

      if (!collection)
      {
        throw new Error(`Model ${this.name} failed to load a database collection for "${name}"`);
      }

      // await this.Seed(collection);
    }

    return collection;
  }

  static GetCollection(){ return this[COLLECTION] || (this[COLLECTION] = this.SetCollection()); }

  static Seed(collection)
  {
  }

  // #update;
  // #filter;

  constructor(actions)
  {
    super();

    if (actions instanceof Array)
    {
      this.ApplyEach(actions);
    }
  }

  // GetUpdate(){ return this.#update ??= {}; }
  // GetFilter(){ return this.#filter ??= {}; }

  // AddFilter(key, operator, value)
  // {
  //   const filter = this.GetFilter();

  //   if ((typeof(value) === "object") && (value !== null) && ((value.constructor === Object) || (value instanceof Model)))
  //   {
  //     // Flatten any nested fields
  //     const keys = Object.keys(value);
  //     for (let i = 0; i < keys.length; i++)
  //     {
  //       const k = keys[i];
  //       this.AddFilter(`${key}.${k}`, operator, value[k]);
  //     }
  //   }
  //   else
  //   {
  //     // This seems to be necessary because of a change to mongodb that makes it always use
  //     // a provided _id with upsert, even if it's null/undefined
  //     if (key === "_id" && value === undefined)
  //     {
  //       // console.log("Generating new ObjectID for undefined _id value");
  //       value = new ObjectID();
  //     }

  //     if (!filter[key]) filter[key] = {};

  //     if ((value !== undefined) || !filter[key].hasOwnProperty(operator))
  //     {
  //       // if ((operator === "$in") || (operator === "$nin"))
  //       // {
  //       //   if (filter[key][operator])
  //       //   {
  //       //     filter[key][operator].push(value);
  //       //   }
  //       //   else
  //       //   {
  //       //     filter[key][operator] = [value];
  //       //   }
  //       // }
  //       // else
  //       // {
  //       //   filter[key][operator] = value;
  //       // }

  //       filter[key][operator] = value;
  //     }
  //   }

  //   return this;
  // }

  // AddUpdate(key, operator, value)
  // {
  //   const update = this.GetUpdate();

  //   // Example: { $set: { [key]: value }}
  //   if (update[operator]) update[operator][key] = value;
  //   else update[operator] = { [key]: value };

  //   return this;
  // }

  // AddValue(key, operator, value)
  // {
  //   this[key] = value;
  //   return this;
  // }

  _AddOperation(key, operator, value, value_string)
  {
    super.AddOperation(key, operator, value, value_string);
    // this.SetAttribute(key, value);

    switch (operator)
    {
      case undefined: break;
      case null: break;
      case "": return this.AddValue(key, operator, value);

      case "??":
      case "exists": return this.AddFilter(key, "$exists", value, "exists");

      // Equal to value
      case "===":
      case "==":
      case "eq": return this.AddFilter(key, "$eq", value, "eq");

      // Not equal to value
      case "!==":
      case "!=":
      case "ne": return this.AddFilter(key, "$ne", value, "ne");

      // Matches ANY of the values specified in the value array
      case "[===]":
      case "[==]":
      case "in": return this.AddFilter(key, "$in", value, "in");

      // Matches NONE of the values specified in the value array
      case "[!==]":
      case "[!=]":
      case "nin": return this.AddFilter(key, "$nin", value, "nin");

      // Basic logical operations
      case ">":
      case "gt": return this.AddFilter(key, "$gt", value, "gt");
      case "<":
      case "lt": return this.AddFilter(key, "$lt", value, "lt");
      case ">=":
      case "gte": return this.AddFilter(key, "$gte", value, "gte");
      case "<=":
      case "lte": return this.AddFilter(key, "$lte", value, "lte");
      // NOTE: Can't think of a good way to implement $and/$or

      case "$":
      case "regex":
      {
        // RegExps should be sent as their default .toString() format,
        // so we need to convert it
        value.replace(/\/(.*)\/(\w*)/, (m, p1, p2) =>
        {
          if (p1) this.AddFilter(key, "$regex", p1, "regex");
          if (p2) this.AddFilter(key, "$options", p2, "options");
        });

        break;
      }

      // case "$text": return this.AddTextFilter(key, "$text", value);

      case "=":
      case "set": return this.AddUpdate(key, "$set", value, "set");

      case "?=":
      case "set_on_insert": return this.AddUpdate(key, "$setOnInsert", value, "set_on_insert");

      // Basic math update operations
      case "++":
      case "inc": return this.AddUpdate(key, "$inc",  1, "inc");

      case "--":
      case "dec": return this.AddUpdate(key, "$inc", -1, "inc");

      case "+=":
      case "add": return this.AddUpdate(key, "$inc", value, "inc");

      case "-=":
      case "sub": return this.AddUpdate(key, "$inc", -value, "inc"); // MongoDB only has $inc, no $sub, so invert it

      case "*=":
      case "mul": return this.AddUpdate(key, "$mul", value, "mul");

      case "/=":
      case "div": return this.AddUpdate(key, "$mul", 1 / value, "mul"); // MongoDB only has $mul, no $div

      case "%=":
      case "mod": return this.AddUpdate(key, "$mod", value, "mod");

      case "min": return this.AddUpdate(key, "$min", value, "min");
      case "max": return this.AddUpdate(key, "$max", value, "max");

      // Delete a field from the model
      case "~":
      case "delete": return this.AddUpdate(key, "$unset", value, "delete");

      case "date": return this.AddUpdate(key, "$currentDate", { $type: "date"      }, "date");
      case "time": return this.AddUpdate(key, "$currentDate", { $type: "timestamp" }, "time");

      case "push"     : return this.AddUpdate(key, "$push", value, "push");
      case "push_each": return this.AddUpdate(key, "$push", { $each: value }, "push_each");

      case "push_unique"     : return this.AddUpdate(key, "$addToSet", value, "push_unique");
      case "push_unique_each": return this.AddUpdate(key, "$addToSet", { $each: value }, "push_unique_each");

      // Finds and removes element(s)
      case "pull"     : return this.AddUpdate(key, "$pull"   , value, "pull");
      case "pull_each": return this.AddUpdate(key, "$pullAll", value, "pull_each");

      case "unshift"     : return this.AddUpdate(key, "$push", { $each: [value], $position: 0 }, "unshift");
      case "unshift_each": return this.AddUpdate(key, "$push", { $each:  value , $position: 0 }, "unshift_each");

      case "pop"  : return this.AddUpdate(key, "$pop",  1, "pop"); // Remove last element
      case "shift": return this.AddUpdate(key, "$pop", -1, "shift"); // Remove first element

      case "&": return this.AddUpdate(key, "$bit", { and: value }, "&");
      case "|": return this.AddUpdate(key, "$bit", { or : value }, "|");
      case "^": return this.AddUpdate(key, "$bit", { xor: value }, "^");

      default: throw new Error(`Unknown Model operator: "${operator}"`);
    }

    return this;
  }

  // Apply a normal object as attributes
  SetAttributes(attributes)
  {
    for (const name in attributes)
    {
      if (!attributes.hasOwnProperty(name)) continue;
      const value = attributes[name];

      this.Apply(name, [undefined, value]);
    }

    return this;
  }

  async PerformDatabaseOperation(action)
  {
    this.ClearActions();

    const collection = await this.constructor.GetCollection();

    switch (action)
    {
      case "insert" : return collection.InsertOne(this);
      case "upsert" : return collection.UpsertOne(this);
      case "resert" : return collection.ResertOne(this);
      case "unsert" : return collection.UnsertOne(this);
      case "delete" : return collection.DeleteOne(this);
      case "update" : return collection.UpdateOne(this);
      case "modify" : return collection.UpdateOne(this);
      case "search" : return collection.FindOne(this);
      case "filter" : return collection.FindAll(this);
      case "exists" : return collection.CountOne(this);
      case "count"  : return collection.CountAll(this);
      case "explain": return collection.ExplainAll(this);
      case "login"  : return collection.FindOne(this);
      case "logout" : return collection.FindOne(this);
      default: throw new Error(`Unknown database operation "${action}"`);
    }
  }

  toJSON()
  {
    return [
      this.constructor.GetLocalName(),
      this.GetActions(),
    ];
  }

  async PerformSendOperation(owner, selector, action, required_mode)
  {
    // if (selector)
    // {
    //   owner = owner.Query(selector);
    //   if (!owner) throw new Error(`Failed to find an owner with selector "${selector}"`);
    // }
    //
    // try
    // {
    //   // Trigger the special hidden access instruction
    //   this.Apply(owner, owner.constructor, []);
    // }
    // catch (error)
    // {
    //   console.error("ERROR WHILE APPLYING:", error);
    //   throw new Error(`"${this.constructor.name}" tag cannot be accessed from a "${owner.constructor.name}" tag`);
    // }
    //
    // this.ValidateMode(action, required_mode);

    this.Action(action);
    this.Selector(selector);

    const result = await this.PerformDatabaseOperation(action);
    return result;
    // const array = this.ToActions(selector, action);
    //
    // return array;

    // const result = await this.PerformDatabaseOperation(action);
    // if (result)
    // {
    //   let tag = new this.constructor();
    //   for (const key in result)
    //   {
    //     if (!result.hasOwnProperty(key)) continue;
    //     const value = result[key];
    //
    //     tag = await tag.Apply(this, key, [undefined, value]);
    //   }
    //
    //   return tag;
    // }
    // else
    // {
    //   return result;
    // }

    // console.log("Database result:", result);
    // return result;
  }

  async PerformSendOperation(owner, selector, action, required_mode)
  {
    // this.Action(action);
    // this.Selector(selector);

    const result = await this.PerformDatabaseOperation(action);

    if (result instanceof Tag)
    {
      return owner.Send([
        "new",
        [
          result.constructor.GetNodeName(),
          result.GetActions(),
        ],
      ]);
    }
    else
    {
      return owner.Send([
        "new",
        [
          "null",
          [],
        ],
      ]);
    }
  }

  async PerformSendOperation(owner, selector, action, required_mode)
  {
    // this.Action(action);
    // this.Selector(selector);

    const result = await this.PerformDatabaseOperation(action);
    return result;
  }

  async PerformSendOperation(action, owner)
  {
    const result = await this.PerformDatabaseOperation(action);
    return result;
  }

  GetCollection(){ return this.constructor.GetCollection(); }

  async Insert (owner){ return (await this.GetCollection())?.InsertOne(this); }
  async Upsert (owner){ return (await this.GetCollection())?.UpsertOne(this); }
  async Resert (owner){ return (await this.GetCollection())?.ResertOne(this); }
  async Unsert (owner){ return (await this.GetCollection())?.UnsertOne(this); }
  async Delete (owner){ return (await this.GetCollection())?.DeleteOne(this); }
  async Update (owner){ return (await this.GetCollection())?.UpdateOne(this); }
  async Modify (owner){ return (await this.GetCollection())?.UpdateOne(this); }
  async Search (owner){ return (await this.GetCollection())?.FindOne(this); }
  async Filter (owner){ return (await this.GetCollection())?.FindAll(this); }
  async Exists (owner){ return (await this.GetCollection())?.CountOne(this); }
  async Count  (owner){ return (await this.GetCollection())?.CountAll(this); }
  // async Number (owner){ return (await this.GetCollection())?.CountAll(this); }
  async Explain(owner){ return (await this.GetCollection())?.ExplainAll(this); }

  async Login(owner)
  {
    const collection = await this.GetCollection();
    const result = await collection.FindOne(this);

    console.log("Logging in on server side", owner.IsConnected(), result.IsConnected());

    if (result && result.constructor === this.constructor)
    {
      owner.AppendChild(result);
    }

    return result;
  }

  async Logout(owner)
  {
    const collection = await this.GetCollection();
    const result = await collection.FindOne(this);

    if (result && result.constructor === this.constructor)
    {
      const target = owner.Query(`#${result.GetID()}`);
      console.log("Logging out on server side", owner.IsConnected(), target.IsConnected());
      if (target)
      {
        target.Remove();
      }
  
      return target;
    }
  }

  Apply(action, args)
  {
    switch (action)
    {
      // On the server side, these should all be called with the owner tag, which is usually the connection
      case "insert" : return this.Insert .apply(this, args);
      case "upsert" : return this.Upsert .apply(this, args);
      case "resert" : return this.Resert .apply(this, args);
      case "unsert" : return this.Unsert .apply(this, args);
      case "delete" : return this.Delete .apply(this, args);
      case "update" : return this.Update .apply(this, args);
      case "modify" : return this.Modify .apply(this, args);
      case "search" : return this.Search .apply(this, args);
      case "filter" : return this.Filter .apply(this, args);
      case "exists" : return this.Exists .apply(this, args);
      case "count"  : return this.Count  .apply(this, args);
      case "explain": return this.Explain.apply(this, args);
      case "login"  : return this.Login  .apply(this, args);
      case "logout" : return this.Logout .apply(this, args);
      default: return super.Apply(action, args);
    }
  }
}
