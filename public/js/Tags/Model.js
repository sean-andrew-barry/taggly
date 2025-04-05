import {Tag} from "/js/Tag.js";
import {ObjectID} from "/js/Utility/Database/ObjectID.js";
import {Binary} from "/js/Utility/Database/Binary.js";
// import {Collection} from "/js/Tags/Database/Collection.js";
import {StringUtilities} from "/js/Utility/String.js";
import * as Functions from "/js/Functions.js";

const ACTIONS = Symbol("actions");
const COLLATION = Symbol("collation");
const PROJECT = Symbol("project");
const SORT = Symbol("sort");
const SKIP = Symbol("skip");
const LIMIT = Symbol("limit");
const TIMEOUT = Symbol("timeout");
const EXPLAIN = Symbol("explain");
const MODE = Symbol("mode");
const ACTION = Symbol("action");
const SELECTOR = Symbol("selector");
const KEY = Symbol("key");

export class Model extends Tag
{
  static GetCollectionName(){ return this.name; }
  static GetClassName(){ return this.name; }
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "model"; }

  static GetActionsSymbol(){ return ACTIONS; }
  static GetCollationSymbol(){ return COLLATION; }
  static GetProjectSymbol(){ return PROJECT; }
  static GetSortSymbol(){ return SORT; }
  static GetSkipSymbol(){ return SKIP; }
  static GetLimitSymbol(){ return LIMIT; }
  static GetTimeoutSymbol(){ return TIMEOUT; }
  static GetExplainSymbol(){ return EXPLAIN; }
  static GetModeSymbol(){ return MODE; }
  static GetActionSymbol(){ return ACTION; }
  static GetSelectorSymbol(){ return SELECTOR; }
  static GetKeySymbol(){ return KEY; }

  static EncodeAttribute(buffer, tag, attribute)
  {
    if (attribute.hasOwnProperty(ACTIONS))
    {
      console.log("Encoding actions...", attribute.name, attribute[ACTIONS]);
      buffer.Write(attribute.name);
      buffer.Write(attribute[ACTIONS]);
    }
    else
    {
      return super.EncodeAttribute(buffer, tag, attribute);
    }
  }

  static DecodeAttribute(buffer, tag)
  {
    const name = buffer.Read();
    const value = buffer.Read();

    if (value instanceof Array)
    {
      tag.Apply(name, value);
    }
    else
    {
      console.log("Applying actions...", name, value);

      // Apply each attribute
      tag.Apply(name, [undefined, value]);
    }
  }

  // static #insert;
  // static #upsert;
  // static #resert;
  // static #unsert;
  // static #delete;
  // static #update;
  // static #modify;
  // static #search;
  // static #filter;
  // static #exists;
  // static #count;
  // static #explain;
  //
  // static get Insert(){ return this.#insert ??= Symbol("insert"); }
  // static get Upsert(){ return this.#upsert ??= Symbol("upsert"); }
  // static get Resert(){ return this.#resert ??= Symbol("resert"); }
  // static get Unsert(){ return this.#unsert ??= Symbol("unsert"); }
  // static get Delete(){ return this.#delete ??= Symbol("delete"); }
  // static get Update(){ return this.#update ??= Symbol("update"); }
  // static get Modify(){ return this.#modify ??= Symbol("modify"); }
  // static get Search(){ return this.#search ??= Symbol("search"); }
  // static get Filter(){ return this.#filter ??= Symbol("filter"); }
  // static get Exists(){ return this.#exists ??= Symbol("exists"); }
  // static get Count(){ return this.#count ??= Symbol("count"); }
  // static get Explain(){ return this.#explain ??= Symbol("explain"); }

  static From(actions)
  {
    const model = new this();

    if (actions instanceof Array)
    {
      model.ApplyEach(actions);
    }

    return model;
  }

  // #project;
  // #sort;
  // #skip;
  // #limit;
  // #timeout;
  // #explain;
  // #mode;
  // #action;
  // #selector;
  // #key;

  constructor(actions)
  {
    super();

    if (actions instanceof Array)
    {
      this.ApplyEach(actions);
    }
  }

  static Encode(buffer, model)
  {
    console.log("Encoded model", model);

    buffer.Write(model.#limit);
    buffer.Write(model.#timeout);
    buffer.Write(model.#skip);
    buffer.Write(model.#project);
    buffer.Write(model.#sort);
    buffer.Write(model.#insert);
    buffer.Write(model.#filter);
    buffer.Write(model.#update);
  }

  static Decode(buffer)
  {
    const model = new this();

    const limit = buffer.Read();
    const timeout = buffer.Read();
    const skip = buffer.Read();
    const project = buffer.Read();
    const sort = buffer.Read();
    const insert = buffer.Read();
    const filter = buffer.Read();
    const update = buffer.Read();

    console.log("DECODED", {
      limit,
      timeout,
      skip,
      project,
      sort,
      insert,
      filter,
      update,
    });

    if (typeof(insert) === "object" && insert !== null)
    {
      for (const key of Object.keys(insert))
      {
        const value = insert[key];
        model.Apply(key, [undefined, value]);
      }
    }

    if (typeof(filter) === "object" && filter !== null)
    {
      for (const key of Object.keys(filter))
      {
        const object = filter[key];

        for (const operator of Object.keys(object))
        {
          const value = object[operator];
          model.Apply(key, [operator, value]);
        }
      }
    }

    if (typeof(update) === "object" && update !== null)
    {
      for (const operator of Object.keys(update))
      {
        const object = update[operator];

        for (const key of Object.keys(object))
        {
          const value = object[key];
          // console.log("Applying", key, operator, value);
          model.Apply(key, [operator, value]);
        }
      }
    }

    return model;
  }

  #limit;
  #timeout;
  #skip;
  #project;
  #sort;
  #insert;
  #filter;
  #update;

  GetInsert(){ return this.#insert ??= {}; }
  GetFilter(){ return this.#filter ??= {}; }
  GetUpdate(){ return this.#update ??= {}; }

  AddToInsert(key, operator, value)
  {
    this.GetInsert()[key] = value;
    return this;
  }

  AddToFilter(key, operator, value)
  {
    const filter = this.GetFilter();

    if ((typeof(value) === "object") && (value !== null) && ((value.constructor === Object) || (value instanceof Model)))
    {
      // Flatten any nested fields
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++)
      {
        const k = keys[i];
        this.AddToFilter(`${key}.${k}`, operator, value[k]);
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

      if (!filter[key]) filter[key] = {};

      if ((value !== undefined) || !filter[key].hasOwnProperty(operator))
      {
        filter[key][operator] = value;
      }
    }

    return this;
  }

  AddToUpdate(key, operator, value)
  {
    const update = this.GetUpdate();

    // Example: { $set: { [key]: value }}
    if (update[operator]) update[operator][key] = value;
    else update[operator] = { [key]: value };

    return this;
  }

  Record(key, operator, value, string)
  {
    this[key] = value;
    this.SetAttribute(key, value, string);

    switch (operator)
    {
      case undefined:
      case null:
      case "": return this.AddToInsert(key, operator, value);

      case "??":
      case "exists":
      case "$exists": return this.AddToFilter(key, "$exists", value, "exists");

      // Equal to value
      case "===":
      case "==":
      case "$eq":
      case "eq": return this.AddToFilter(key, "$eq", value, "eq");

      // Not equal to value
      case "!==":
      case "!=":
      case "$ne":
      case "ne": return this.AddToFilter(key, "$ne", value, "ne");

      // Matches ANY of the values specified in the value array
      case "[===]":
      case "[==]":
      case "$in":
      case "in": return this.AddToFilter(key, "$in", value, "in");

      // Matches NONE of the values specified in the value array
      case "[!==]":
      case "[!=]":
      case "$nin":
      case "nin": return this.AddToFilter(key, "$nin", value, "nin");

      // Basic logical operations
      case ">":
      case "$gt":
      case "gt": return this.AddToFilter(key, "$gt", value, "gt");
      case "<":
      case "$lt":
      case "lt": return this.AddToFilter(key, "$lt", value, "lt");
      case ">=":
      case "$gte":
      case "gte": return this.AddToFilter(key, "$gte", value, "gte");
      case "<=":
      case "$lte":
      case "lte": return this.AddToFilter(key, "$lte", value, "lte");
      // NOTE: Can't think of a good way to implement $and/$or

      case "$regex": this.AddToFilter(key, "$regex", value, "regex");
      case "$options": this.AddToFilter(key, "$options", value, "options");

      // NOTE: This maybe should only happen on server side?
      case "$":
      case "$option":
      case "regex":
      {
        // RegExps should be sent as their default .toString() format,
        // so we need to convert it
        value.replace(/\/(.*)\/(\w*)/, (m, p1, p2) =>
        {
          if (p1) this.AddToFilter(key, "$regex", p1, "regex");
          if (p2) this.AddToFilter(key, "$options", p2, "options");
        });

        break;
      }

      // case "$text": return this.AddTextFilter(key, "$text", value);

      case "=":
      case "$set":
      case "set": return this.AddToUpdate(key, "$set", value, "set");

      case "?=":
      case "??=":
      case "$setOnInsert":
      case "set_on_insert": return this.AddToUpdate(key, "$setOnInsert", value, "set_on_insert");

      // Basic math update operations
      case "$inc": return this.AddToUpdate(key, "$inc", value, "inc");

      case "++":
      case "inc": return this.AddToUpdate(key, "$inc",  1, "inc");
        
      case "--":
      case "dec": return this.AddToUpdate(key, "$inc", -1, "inc");

      // NOTE: Do some of these need to be server side specific? Maybe
      case "+=":
      case "add": return this.AddToUpdate(key, "$inc", value, "inc");

      case "-=":
      case "sub": return this.AddToUpdate(key, "$inc", -value, "inc"); // MongoDB only has $inc, no $sub, so invert it

      case "*=":
      case "$mul":
      case "mul": return this.AddToUpdate(key, "$mul", value, "mul");

      case "/=":
      case "div": return this.AddToUpdate(key, "$mul", 1 / value, "mul"); // MongoDB only has $mul, no $div

      case "%=":
      case "$mod":
      case "mod": return this.AddToUpdate(key, "$mod", value, "mod");

      case "$min":
      case "min": return this.AddToUpdate(key, "$min", value, "min");
      case "$max":
      case "max": return this.AddToUpdate(key, "$max", value, "max");

      // Delete a field from the model
      case "~":
      case "$unset":
      case "delete": return this.AddToUpdate(key, "$unset", value, "delete");

      case "date": return this.AddToUpdate(key, "$currentDate", { $type: "date"      }, "date");
      case "time": return this.AddToUpdate(key, "$currentDate", { $type: "timestamp" }, "time");

      case "$push":
      case "push"     : return this.AddToUpdate(key, "$push", value, "push");
      case "push_each": return this.AddToUpdate(key, "$push", { $each: value }, "push_each");

      case "$addToSet":
      case "push_unique"     : return this.AddToUpdate(key, "$addToSet", value, "push_unique");
      case "push_unique_each": return this.AddToUpdate(key, "$addToSet", { $each: value }, "push_unique_each");

      // Finds and removes element(s)
      case "$pull":
      case "pull": return this.AddToUpdate(key, "$pull", value, "pull");
      case "$pullAll":
      case "pull_each": return this.AddToUpdate(key, "$pullAll", value, "pull_each");

      case "unshift"     : return this.AddToUpdate(key, "$push", { $each: [value], $position: 0 }, "unshift");
      case "unshift_each": return this.AddToUpdate(key, "$push", { $each:  value , $position: 0 }, "unshift_each");
      case "$push": return this.AddToUpdate(key, "$push", value);

      case "pop"  : return this.AddToUpdate(key, "$pop",  1, "pop"); // Remove last element
      case "shift": return this.AddToUpdate(key, "$pop", -1, "shift"); // Remove first element
      case "$pop" : return this.AddToUpdate(key, "$pop", value, "pop");
      
      case "&": return this.AddToUpdate(key, "$bit", { and: value }, "&");
      case "|": return this.AddToUpdate(key, "$bit", { or : value }, "|");
      case "^": return this.AddToUpdate(key, "$bit", { xor: value }, "^");
      case "$bit": return this.AddToUpdate(key, "$bit", value, "&");

      default: throw new Error(`Unknown Model operator: "${operator}"`);
    }

    return this;
  }

  Project(value){ return this.Set(PROJECT, value).Record("project", [value]); }
  Sort(value){ return this.Set(SORT, value).Record("sort", [value]); }
  Skip(value){ return this.Set(SKIP, value).Record("skip", [value]); }
  Limit(value){ return this.Set(LIMIT, value).Record("limit", [value]); }
  Timeout(value){ return this.Set(TIMEOUT, value).Record("timeout", [value]); }
  Explain(value){ return this.Set(EXPLAIN, value).Record("explain", [value]); }
  Mode(value){ return this.Set(MODE, value).Record("mode", [value]); }
  Action(value){ return this.Set(ACTION, value).Record("action", [value]); }
  Selector(value){ return this.Set(SELECTOR, value).Record("selector", [value]); }
  Key(value){ return this.Set(KEY, value).Record("key", [value]); }

  GetProject(){ return this[PROJECT]; }
  GetSort(){ return this[SORT]; }
  GetSkip(){ return this[SKIP]; }
  GetLimit(){ return this[LIMIT]; }
  GetTimeout(){ return this[TIMEOUT]; }
  GetExplain(){ return this[EXPLAIN]; }
  GetMode(){ return this[MODE]; }
  GetAction(){ return this[ACTION]; }
  GetSelector(){ return this[SELECTOR]; }
  GetActions(){ return this[ACTIONS] ??= []; }

  ClearActions()
  {
    this[ACTIONS] = [];
    return this;
  }

  _Record(action, args = [])
  {
    const actions = this.GetActions();
    actions.push(action, args);
    return this;
  }

  GetID(){ return this._id || this.GetAttribute("id"); }

  SetBoolean(key, operator, value, match)
  {
    if (value !== undefined)
    {
      if (typeof(value) === "string")
      {
        if (value === "true") value = true;
        else if (value === "false") value = false;
      }

      const e = this.Expect(value).Named(key).ToBeBoolean();
      if (typeof(match) === "boolean") e.ToEqual(match);
    }

    return this.AddOperation(key, operator, value);
  }

  SetValue(key, operator, value)
  {
    // this[key] = value;
    // return this.Record(key, [operator, value]);

    return this.Record(key, operator, value);

    // return this;
  }

  SetNumber(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      if (typeof(value) === "string")
      {
        value = Number(value);
      }

      const e = this.Expect(value).Named(key).ToBeNumber();

      if (typeof(min) === "number") e.ToBeGreaterThan(min);
      if (typeof(max) === "number") e.ToBeLessThan(max);
    }

    return this.Record(key, operator, value);
  }

  SetString(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      if (value instanceof RegExp)
      {
        value = value.toString();
      }

      const e = this.Expect(value).Named(key).ToBeString();
      if (typeof(min) === "number") e.ToBeLongerThan(min);
      if (typeof(max) === "number") e.ToBeShorterThan(max);
    }

    return this.Record(key, operator, value);
  }

  SetSlug(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      const e = this.Expect(value).Named(key).ToBeString();

      // If the string is a RegExp, then don't convert it to a slug
      if (!(/\/(.*)\/(\w*)/.test(value)))
      {
        value = StringUtilities.ToSlug(value);
      }

      if (typeof(min) === "number") e.ToBeLongerThan(min);
      if (typeof(max) === "number") e.ToBeShorterThan(max);
    }

    return this.AddOperation(key, operator, value);
  }

  SetBinary(key, operator, value, bytes)
  {
    if (value !== undefined)
    {
      // if (value instanceof ArrayBuffer)
      // {
      //   if (global.Buffer)
      //   {
      //     value = Buffer.from(value);
      //   }
      //   else
      //   {
      //     value = new Uint8Array(value);
      //   }
      // }

      // if (global.Buffer && value instanceof Uint8Array)
      // {
      //   value = Buffer.from(value);
      // }

      if (!(value instanceof Binary))
      {
        value = new Binary(value);
      }

      if (!(value instanceof Binary))
      {
        throw new Error(`Expected ${key} to be a Binary`);
      }

      if (bytes !== undefined && value.length() > bytes)
      {
        throw new Error(`Expected ${key} to be smaller than ${bytes} bytes`);
      }
    }

    return this.AddOperation(key, operator, value);
  }

  SetBinary(key, operator, value, bytes)
  {
    if (value !== undefined)
    {
      console.log("SetBinary", value);
      if (bytes !== undefined && value.length > bytes)
      {
        throw new Error(`Expected ${key} to be smaller than ${bytes} bytes`);
      }
    }

    return this.AddOperation(key, operator, value);
  }

  SetUint8Array(key, operator, value, bytes)
  {
    if (value !== undefined)
    {
      // console.log("SetUint8Array", value);

      if (value instanceof Binary)
      {
        value = new Uint8Array(value.buffer);
      }
      else if (!(value instanceof Uint8Array))
      {
        value = new Uint8Array(value);
      }

      if (bytes !== undefined && value.byteLength > bytes)
      {
        throw new Error(`Expected ${key} to be smaller than ${bytes} bytes`);
      }

      this.Expect(value).Named(key).ToBeUint8Array();
    }

    return this.AddOperation(key, operator, value, `Uint8Array(${value.length})`);
  }

  SetDate(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      const t = typeof(value);
      if (t === "string" || t === "number")
      {
        value = new Date(value);
      }

      const e = this.Expect(value).Named(key);
      if (min instanceof Date) e.ToBeOlderThan(min);
      if (max instanceof Date) e.ToBeYoungerThan(max);
    }

    return this.AddOperation(key, operator, value);
  }

  SetMinutes(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      if (typeof(value) === "number")
      {
        value = new Date(Date.now() + value * 60 * 1000);
      }
    }

    return this.SetDate(key, operator, value, min, max);
  }

  SetSeconds(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      if (typeof(value) === "number")
      {
        value = new Date(Date.now() + value * 1000);
      }
    }

    return this.SetDate(key, operator, value, min, max);
  }

  SetMilliseconds(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      if (typeof(value) === "number")
      {
        value = new Date(Date.now() + value);
      }
    }

    return this.SetDate(key, operator, value, min, max);
  }

  SetArray(key, operator, value, max_size)
  {
    if (value !== undefined)
    {
      const e = this.Expect(value).Named(key).ToBeArray();
      if (typeof(max_size) === "number") e.ToBeSmallerThan(max_size);
    }

    return this.AddOperation(key, operator, value);
  }

  SetArray(key, operator, value, expectation, max_size)
  {
    if (value !== undefined)
    {
      const e = this.Expect(value).Named(key).ToBeArray();
      if (typeof(max_size) === "number") e.ToBeSmallerThan(max_size);

      if (typeof(expectation) === "function")
      {
        for (let i = 0; i < value.length; i++)
        {
          expectation(this.Expect(value[i]).Named(`${key}[${i}]`));
        }
      }
    }

    return this.AddOperation(key, operator, value, "[array]");
  }

  SetObject(key, operator, value, max_size)
  {
    if (value !== undefined)
    {
      const e = this.Expect(value).Named(key).ToBeObject();
      if (typeof(max_size) === "number") e.ToBeSmallerThan(max_size);
    }

    return this.AddOperation(key, operator, value, "[object]");
  }

  SetType(key, operator, value)
  {
    if (value !== undefined)
    {
      const ctor = this.constructor.GetType(value);
      if (!ctor) throw new Error(`Invalid Model type of "${value}"`);

      this.AddAction(key, [operator, value]);
    }
    else
    {
      this.AddAction(key, [operator]);
    }

    return this.Set(key, value);
  }

  SetModel(key, operator, value, type = Model)
  {
    if (value !== undefined)
    {
      if (value instanceof Array)
      {
        const parent = this.GetParent();
        const promise = parent.Apply.apply(parent, value).then(value =>
        {
          this.Set(key, value);
          return value;
        });

        return this;
      }

      if (value instanceof Model)
      {
        // Store the type of any nested model
        value._type = value.constructor.name;
      }
      else
      {
        // Assume that the value is raw data from the client or database
        const ctor = this.constructor.GetType(value._type);
        if (!ctor) throw new Error(`Invalid _type "${value._type}" for Model validation`);

        // Construct the model as its _type field specifies
        value = new ctor(this.GetParent()).Copy(value);
        // value = this.Copy(value);

        if (global.IsServer())
        {
          value._type = ctor.name;
        }
      }

      // Load the required type if it was given as a string instead of a class
      if (typeof(type) === "string")
      {
        const temp = this.constructor.GetType(type);
        if (!temp) throw new Error(`Invalid Model type of "${type}"`);

        type = temp;
      }

      // Make sure the model, regardless of where it came from, is an instance of the type
      if (!(value instanceof type))
      {
        throw new Error(`Invalid type "${value.constructor.name}", expected ${type.name}`);
      }
      this.AddAction(key, [operator, value]);
    }
    else
    {
      this.AddAction(key, [operator]);
    }

    return this.Set(key, value);
  }

  SetObjectID(key, operator, value)
  {
    // console.log("Model.SetObjectID", [key, operator, value]);

    // if (value === undefined || value === null)
    // {
    //   value = NULL_OBJECT_ID;
    // }

    if (value === "" || value === "null")
    {
      value = null;
    }

    if (value !== undefined && value !== null)
    {
      if (typeof(value) === "string")
      {
        const temp = value;

        try
        {
          value = new ObjectID(value);
        }
        catch (error)
        {
          value = temp;
        }
      }

      // console.log("Expecting value to be ObjectID", value);

      this.Expect(value).Named(key).ToBeInstanceOf(ObjectID);
    }

    return this.Record(key, operator, value);
  }

  SetHTML(key, operator, value)
  {
    if (typeof(value) === "string")
    {
      this.InnerHTML(value, false);
    }

    return this.AddOperation(key, operator, value);
  }

  SetHTML(key, operator, value, min, max)
  {
    if (value !== undefined)
    {
      if (value instanceof RegExp)
      {
        value = value.toString();
      }

      const e = this.Expect(value).Named(key).ToBeString();
      if (typeof(min) === "number") e.ToBeLongerThan(min);
      if (typeof(max) === "number") e.ToBeShorterThan(max);
    }

    return this.AddOperation(key, operator, value, "[html]");
  }

  _AddOperation(key, operator, value, value_string)
  {
    let call;
    if (value === undefined || value === null) call = [operator];
    else call = [operator, value];

    this.Record(key, call);
    this.SetAttribute(key, value_string || value);

    if (value !== undefined && value !== null)
    {
      return this.Set(key, value);
    }
    else
    {
      return this;
    }


    // return this.Set(key, value).UpdateAttribute(key, value, call, value_string);
  }

  ValidateMode(action, required)
  {
    const mode = this.GetMode();
    if (!mode)
    {
      throw new Error(`Invalid Model.${this.constructor.name} mode of "${mode}"`);
    }

    // console.log(action, "Validating mode:", mode, "against", required);

    // A special mode that grants all modes at once
    if (mode === "*") return;

    for (let i = 0; i < required.length; i++)
    {
      const r = required[i];
      if (!mode.includes(r))
      {
        throw new Error(`Action ${action} requires mode ${r}, but the Model only allows ${mode}`);
      }
    }
  }

  ID(v, o){ return this.SetObjectID("_id", v, o); }

  async PerformSendOperation(owner, selector, action)
  {
    if (selector === undefined && owner)
    {
      selector = owner.GetNodeName();
    }

    // const socket = await Tag.Socket().Wait();
    const socket = await Tag.Head().GetSocket();
    const connection = await socket.GetConnection();

    // this.ToActions(selector, action)
    this.Action(action);
    this.Selector(selector);

    return connection.Send(this);
  }

  Send(tag)
  {
    const parent = this.GetParent();
    if (!parent) throw new Error(`Cannot send through a model that doesn't have a parent`);

    return parent.Send(tag);
  }

  Call(fn, ...args)
  {
    const parent = this.GetParent();
    if (!parent) throw new Error(`Cannot send through a model that doesn't have a parent`);

    return parent.Call(fn, ...args);
  }

  async PerformSendOperation(owner, selector, action)
  {
    if (selector === null)
    {
    }
    else if (typeof(selector) === "string")
    {
      this.SetAttribute("target", selector);
    }
    else if (owner)
    {
      selector = owner.constructor.GetLocalName();
      this.SetAttribute("target", selector);
    }

    this.SetAttribute("action", action);

    // console.log("Sending with", selector, action);

    return owner.Send(this.toJSON()).then(result =>
    {
      console.log("Model got back", result);
      return this.ApplyEach(result);
    });
  }

  async PerformSendOperation(action, owner)
  {
    console.log("Sending with", action, owner);

    const result = await owner.Call(action, owner.GetID(), this);

    console.log("Model got back", result);
    return result;
    // return this.ApplyEach(result);

    // return owner.Send(this.toJSON()).then(result =>
    // {
    //   console.log("Model got back", result);
    //   return this.ApplyEach(result);
    // });
  }

  ToActions()
  {
    const actions = [];

    actions.push.apply(actions, this.GetActions());

    const node = this.GetNode();

    if (node.children.length > 0)
    {
      const children = [];
      for (let i = 0; i < node.children.length; i++)
      {
        const tag = this.Convert(node.children[i]);
        if (tag) children.push.apply(children, tag.ToActions());
      }

      actions.push("children", children);
    }

    return [
      "construct",
      [
        this.GetLocalName(),
        actions,
      ],
    ];
  }

  ApplyAttribute(name, value)
  {
    return this.Apply(name, [null, value]);
  }

  toJSON()
  {
    return [
      "target",
      [
        this.GetAttribute("target") || null,
        [
          `${this.constructor.GetLocalName()}.${this.GetAttribute("action")}`, // "user.login"
          this.GetActions(),
        ],
      ],
    ];
  }

  // toJSON()
  // {
  //   return [
  //     `${this.constructor.GetLocalName()}.${this.GetAttribute("action")}`, // "user.login"
  //     this.GetActions(),
  //   ];
  // }

  Insert (owner, selector){ return this.PerformSendOperation(owner, selector, "insert" ); }
  Upsert (owner, selector){ return this.PerformSendOperation(owner, selector, "upsert" ); }
  Resert (owner, selector){ return this.PerformSendOperation(owner, selector, "resert" ); }
  Unsert (owner, selector){ return this.PerformSendOperation(owner, selector, "unsert" ); }
  Delete (owner, selector){ return this.PerformSendOperation(owner, selector, "delete" ); }
  Update (owner, selector){ return this.PerformSendOperation(owner, selector, "update" ); }
  Modify (owner, selector){ return this.PerformSendOperation(owner, selector, "modify" ); }
  Search (owner, selector){ return this.PerformSendOperation(owner, selector, "search" ); }
  Filter (owner, selector){ return this.PerformSendOperation(owner, selector, "filter" ); }
  Exists (owner, selector){ return this.PerformSendOperation(owner, selector, "exists" ); }
  Count  (owner, selector){ return this.PerformSendOperation(owner, selector, "count"  ); }
  Explain(owner, selector){ return this.PerformSendOperation(owner, selector, "explain"); }

  Insert (owner){ return this.PerformSendOperation(Functions.ModelInsert , owner); }
  Upsert (owner){ return this.PerformSendOperation(Functions.ModelUpsert , owner); }
  Resert (owner){ return this.PerformSendOperation(Functions.ModelResert , owner); }
  Unsert (owner){ return this.PerformSendOperation(Functions.ModelUnsert , owner); }
  Delete (owner){ return this.PerformSendOperation(Functions.ModelDelete , owner); }
  Update (owner){ return this.PerformSendOperation(Functions.ModelUpdate , owner); }
  Modify (owner){ return this.PerformSendOperation(Functions.ModelModify , owner); }
  Search (owner){ return this.PerformSendOperation(Functions.ModelSearch , owner); }
  Filter (owner){ return this.PerformSendOperation(Functions.ModelFilter , owner); }
  Exists (owner){ return this.PerformSendOperation(Functions.ModelExists , owner); }
  Count  (owner){ return this.PerformSendOperation(Functions.ModelCount  , owner); }
  Explain(owner){ return this.PerformSendOperation(Functions.ModelExplain, owner); }
  Test   (owner){ return this.PerformSendOperation(Functions.ModelTest   , owner); }

  Login(owner, selector)
  {
    // console.log("Calling default Model.Login", this, owner);
    return this.PerformSendOperation(owner, selector, "login").then(result =>
    {
      if (result && result.constructor === this.constructor)
      {
        owner.AppendChild(result);
      }

      return result;
    });
  }

  Logout(owner, selector)
  {
    return this.PerformSendOperation(owner, selector, "logout").then(result =>
    {
      const target = owner.Query(this.GetLocalName());
      console.log("Logging out on server side", owner.IsConnected(), target.IsConnected());
      if (target)
      {
        target.Remove();
      }

      // console.log("Logging out of", result.IsConnected(), this.IsConnected(), owner);
      // if (result && result.constructor === this.constructor)
      // {
      //   owner.RemoveChild(result);
      // }

      return target;
    });
  }

  async Login(owner)
  {
    const result = await this.PerformSendOperation(Functions.ModelLogin, owner);

    if (result && result.constructor === this.constructor)
    {
      console.log("Logging in on client side", owner.IsConnected(), result.IsConnected());

      owner.AppendChild(result);
    }

    return result;
  }

  async Logout(owner)
  {
    const result = await this.PerformSendOperation(Functions.ModelLogout, owner);

    if (result && result.constructor === this.constructor)
    {
      const target = owner.Query(`#${result.GetID()}`);
      console.log("Logging out on client side", owner.IsConnected(), target.IsConnected());

      if (target)
      {
        target.Remove();
      }
  
      return target;
    }
  }

  Target(selector, args)
  {
    let target = this;
    if (typeof(selector) === "string")
    {
      target = this.Query(selector);
      if (!target) throw new Error(`Failed to target a child of the owner with selector "${selector}"`);
    }

    return target.Apply(...args);
  }

  Apply(action, args)
  {
    switch (action)
    {
      case this.GetLocalName(): return this.ApplyEach(args);
      case "_id": return this.ID.apply(this, args);
      case "project": return this.Project.apply(this, args);
      case "sort": return this.Sort.apply(this, args);
      case "skip": return this.Skip.apply(this, args);
      case "limit": return this.Limit.apply(this, args);
      case "timeout": return this.Timeout.apply(this, args);
      case "explain": return this.Explain.apply(this, args);
      case "collation": return this.Collation.apply(this, args);
      case "mode": return this.Mode.apply(this, args);
      case "action": return this.Action.apply(this, args);
      case "selector": return this.Selector.apply(this, args);
      case "target": return this.Target.apply(this, args);

      case "_insert" : return this.Insert.apply(this, args);
      case "_upsert" : return this.Upsert.apply(this, args);
      case "_resert" : return this.Resert.apply(this, args);
      case "_unsert" : return this.Unsert.apply(this, args);
      case "_delete" : return this.Delete.apply(this, args);
      case "_update" : return this.Update.apply(this, args);
      case "_modify" : return this.Modify.apply(this, args);
      case "_search" : return this.Search.apply(this, args);
      case "_filter" : return this.Filter.apply(this, args);
      case "_exists" : return this.Exists.apply(this, args);
      case "_count"  : return this.Count.apply(this, args);
      case "_explain": return this.Explain.apply(this, args);
      case "_login"  : return this.Login.apply(this, args);
      case "_logout" : return this.Logout.apply(this, args);

      default: return super.Apply(action, args);
    }
  }

  Action(action)
  {
    return this.SetAttribute("action", action);
  }

  New(){ return new this.constructor(); }

  // From(object)
  // {
  //   const model = new this.constructor();

  //   for (const name in object)
  //   {
  //     if (!object.hasOwnProperty(name)) continue;
  //     const value = object[name];

  //     model.Apply(name, [undefined, value]);
  //   }

  //   return model;
  // }
}
