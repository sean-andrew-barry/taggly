import {Record as Base} from "/js/Tags/Database/Record.js?next=taggly";

const PROJECTIONS = Symbol("projections");
const SORTS = Symbol("sorts");
const FILTERS = Symbol("filters");
const UPDATES = Symbol("updates");
const VALUES = Symbol("values" );

export class Record extends Base
{
  ThrowNoTarget(target, action, selector)
  {
    throw new Error(`Record "${this.GetLocalName()}" received action "${action}" without a target`);
  }

  ThrowTargetNotContained(target, action, selector)
  {
    throw new Error(`Record "${this.GetLocalName()}" was told to target "${selector}", but the target is not a child of the record`);
  }

  GetFilters(){ return this[FILTERS] ??= {}; }
  GetUpdates(){ return this[UPDATES] ??= {}; }
  GetValues(){ return this[VALUES] ??= {}; }

  AddFilter(key, operator, value)
  {
    const filters = this.GetFilters();

    if ((typeof(value) === "object") && (value !== null) && ((value.constructor === Object) || (value instanceof this.constructor)))
    {
      // Flatten any nested fields
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++)
      {
        const k = keys[i];
        this.AddFilter(`${key}.${k}`, operator, value[k]);
      }
    }
    else
    {
      // This seems to be necessary because of a change to mongodb that makes it always use
      // a provided _id with upsert, even if it's null/undefined
      if (key === "_id" && value === undefined)
      {
        // console.log("Generating new ObjectID for undefined _id value");
        value = new ObjectID();
      }

      if (!filters[key]) filters[key] = {};

      if ((value !== undefined) || !filters[key].hasOwnProperty(operator))
      {
        filters[key][operator] = value;
      }
    }

    return this;
  }

  AddUpdate(key, operator, value)
  {
    const updates = this.GetUpdates();

    if (updates[operator]) updates[operator][key] = value;
    else updates[operator] = { [key]: value };

    return this;
  }

  AddValue(key, operator, value)
  {
    const values = this.GetValues();
    values[key] = value;
    return this;
  }

  AddAction(action, operation, value)
  {
    switch (operator)
    {
      case undefined: break;
      case null: break;
      case "": return this.AddValue(action, operator, value);

      // Equal to value
      case "===":
      case "==":
      case "eq": return this.AddFilter(action, "$eq", value, "eq");

      // Not equal to value
      case "!==":
      case "!=":
      case "ne": return this.AddFilter(action, "$ne", value, "ne");

      // Matches ANY of the values specified in the value array
      case "[===]":
      case "[==]":
      case "in": return this.AddFilter(action, "$in", value, "in");

      // Matches NONE of the values specified in the value array
      case "[!==]":
      case "[!=]":
      case "nin": return this.AddFilter(action, "$nin", value, "nin");

      // Basic logical operations
      case ">":
      case "gt": return this.AddFilter(action, "$gt", value, "gt");
      case "<":
      case "lt": return this.AddFilter(action, "$lt", value, "lt");
      case ">=":
      case "gte": return this.AddFilter(action, "$gte", value, "gte");
      case "<=":
      case "lte": return this.AddFilter(action, "$lte", value, "lte");
      // NOTE: Can't think of a good way to implement $and/$or

      case "$":
      case "regex":
      {
        // RegExps should be sent as their default .toString() format,
        // so we need to convert it
        value.replace(/\/(.*)\/(\w*)/, (m, p1, p2) =>
        {
          if (p1) this.AddFilter(action, "$regex", p1, "regex");
          if (p2) this.AddFilter(action, "$options", p2, "options");
        });

        break;
      }

      // case "$text": return this.AddTextFilter(key, "$text", value);

      case "=":
      case "set": return this.AddUpdate(action, "$set", value, "set");

      case "?=":
      case "set_on_insert": return this.AddUpdate(action, "$setOnInsert", value, "set_on_insert");

      // Basic math update operations
      case "++":
      case "inc": return this.AddUpdate(action, "$inc",  1, "inc");
      case "--":
      case "dec": return this.AddUpdate(action, "$inc", -1, "inc");
      case "+=":
      case "add": return this.AddUpdate(action, "$inc", value, "inc");
      case "-=":
      case "sub": return this.AddUpdate(action, "$inc", -value, "inc"); // MongoDB only has $inc, no $sub, so invert it
      case "*=":
      case "mul": return this.AddUpdate(action, "$mul", value, "mul");
      case "/=":
      case "div": return this.AddUpdate(action, "$mul", 1 / value, "mul"); // MongoDB only has $mul, no $div
      case "%=":
      case "mod": return this.AddUpdate(action, "$mod", value, "mod");
      case "min": return this.AddUpdate(action, "$min", value, "min");
      case "max": return this.AddUpdate(action, "$max", value, "max");

      // Delete a field from the model
      case "~":
      case "delete": return this.AddUpdate(action, "$unset", value, "delete");

      case "date": return this.AddUpdate(action, "$currentDate", { $type: "date"      }, "date");
      case "time": return this.AddUpdate(action, "$currentDate", { $type: "timestamp" }, "time");

      case "push"     : return this.AddUpdate(action, "$push", value, "push");
      case "push_each": return this.AddUpdate(action, "$push", { $each: value }, "push_each");

      case "push_unique"     : return this.AddUpdate(action, "$addToSet", value, "push_unique");
      case "push_unique_each": return this.AddUpdate(action, "$addToSet", { $each: value }, "push_unique_each");

      // Finds and removes element(s)
      case "pull"     : return this.AddUpdate(action, "$pull"   , value, "pull");
      case "pull_each": return this.AddUpdate(action, "$pullAll", value, "pull_each");

      case "unshift"     : return this.AddUpdate(action, "$push", { $each: [value], $position: 0 }, "unshift");
      case "unshift_each": return this.AddUpdate(action, "$push", { $each:  value , $position: 0 }, "unshift_each");

      case "pop"  : return this.AddUpdate(action, "$pop",  1, "pop"); // Remove last element
      case "shift": return this.AddUpdate(action, "$pop", -1, "shift"); // Remove first element

      case "&": return this.AddUpdate(action, "$bit", { and: value }, "&");
      case "|": return this.AddUpdate(action, "$bit", { or : value }, "|");
      case "^": return this.AddUpdate(action, "$bit", { xor: value }, "^");

      default: throw new Error(`Unknown operator: "${operator}"`);
    }
  }

  Target(selector, action, ...args)
  {
    // Attempt to find the target using the selector
    const target = this.Query(selector);

    if (!target) return this.ThrowNoTarget(target, action, selector);
    if (!this.Contains(target)) return this.ThrowTargetNotContained(target, action, selector);

    return target.Apply(action, args);
  }

  async PerformDatabaseOperation(action)
  {
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

  // For each of these, save the action, then send through the target
  Search(target){ return this.Action(`${this.GetLocalName()}.search`, target.GetSelector()).Send(target); }
  Filter(target){ return this.Action(`${this.GetLocalName()}.filter`, target.GetSelector()).Send(target); }
  Insert(target){ return this.Action(`${this.GetLocalName()}.insert`, target.GetSelector()).Send(target); }
  Upsert(target){ return this.Action(`${this.GetLocalName()}.upsert`, target.GetSelector()).Send(target); }
  Resert(target){ return this.Action(`${this.GetLocalName()}.resert`, target.GetSelector()).Send(target); }
  Delete(target){ return this.Action(`${this.GetLocalName()}.delete`, target.GetSelector()).Send(target); }
  Login (target){ return this.Action(`${this.GetLocalName()}.login` , target.GetSelector()).Send(target); }
}


export class Collection extends Tag
{
  ApplyEach(actions)
  {

  }

  Apply(action, args)
  {
    switch (action)
    {
      case option:
      default:
      {
      }
    }
  }
}
