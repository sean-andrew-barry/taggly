import {Tag} from "/js/Tag.js";

import {Operation} from "/js/Utility/Database/Operation.js";
import {ObjectID} from "/js/Utility/Database/ObjectID.js";

const PROJECTION = Symbol("projection");
const SORT = Symbol("sort");

const SEARCH = Symbol("search");
const FILTER = Symbol("filter");
const INSERT = Symbol("insert");
const UNSERT = Symbol("unsert");
const UPSERT = Symbol("upsert");
const RESERT = Symbol("resert");
const UPDATE = Symbol("update");
const MODIFY = Symbol("modify");
const DELETE = Symbol("delete");
const COUNT  = Symbol("count" );
const LOGIN  = Symbol("login" );
const LOGOUT = Symbol("logout");

export class Record extends Tag
{
  static GetLocalName(){ return "record"; }
  static GetMetaURL(){ return import.meta.url; }

  static GetSearchSymbol(){ return SEARCH; }
  static GetFilterSymbol(){ return FILTER; }
  static GetInsertSymbol(){ return INSERT; }
  static GetUnsertSymbol(){ return UNSERT; }
  static GetUpsertSymbol(){ return UPSERT; }
  static GetResertSymbol(){ return RESERT; }
  static GetUpdateSymbol(){ return UPDATE; }
  static GetModifySymbol(){ return MODIFY; }
  static GetDeleteSymbol(){ return DELETE; }
  static GetLoginSymbol (){ return LOGIN ; }
  static GetLogoutSymbol(){ return LOGOUT; }

  static get Search(){ return this[SEARCH] ??= Symbol("search"); }
  static get Filter(){ return this[FILTER] ??= Symbol("filter"); }
  static get Insert(){ return this[INSERT] ??= Symbol("insert"); }
  static get Unsert(){ return this[UNSERT] ??= Symbol("unsert"); }
  static get Upsert(){ return this[UPSERT] ??= Symbol("upsert"); }
  static get Resert(){ return this[RESERT] ??= Symbol("resert"); }
  static get Update(){ return this[UPDATE] ??= Symbol("update"); }
  static get Modify(){ return this[MODIFY] ??= Symbol("modify"); }
  static get Delete(){ return this[DELETE] ??= Symbol("delete"); }
  static get Count (){ return this[COUNT ] ??= Symbol("count" ); }
  static get Login (){ return this[LOGIN ] ??= Symbol("login" ); }
  static get Logout(){ return this[LOGOUT] ??= Symbol("logout"); }

  // static EncodeAttributes(buffer, tag)
  // {
  //   const start = buffer.GetOffset();
  //
  //   // We don't know the size yet, so simply put a 0 for now
  //   buffer.WriteU32(0);
  //
  //   for (const {name, value} of tag.EachAttribute())
  //   {
  //     buffer.Write(name);
  //     buffer.Write(value);
  //   }
  //
  //   // Now that we know the size, overwrite that 0 with the end offset
  //   buffer.WriteU32(buffer.GetOffset(), start, 0);
  // }

  static DecodeAttributes(buffer)
  {
    const record = new this();

    const end = buffer.ReadU32();
    while (end > buffer.GetIndex())
    {
      const name  = buffer.Read();
      const value = buffer.Read();

      if (value instanceof Operation)
      {
        // Apply each attribute
        record.Apply(name, [value.operator, value.value]);
      }
      else
      {
        // Apply each attribute
        record.Apply(name, [value]);
      }
    }

    return record;
  }

  GetProjection(){ return this[PROJECTION] ??= {}; }
  GetSort(){ return this[SORT] ??= {}; }

  ThrowNoTarget(target, action)
  {
    throw new Error(`Record "${this.GetLocalName()}" tried to send action "${action}" without a target`);
  }

  ThrowTargetNotConnected(target, action)
  {
    throw new Error(`Record "${this.GetLocalName()}" tried to send action "${action}" but the target is not connected to the DOM`);
  }

  // Simply forward it to the parent, until the parent is a Connection
  Send(actions){ return this.GetParent()?.Send?.(actions); }

  async Target(target, action)
  {
    if (!target) return this.ThrowNoTarget(target, action);
    if (!target.IsConnected()) return this.ThrowTargetNotConnected(target, action);

    // Result comes back in the form of:
    // ["client.accept", [...]], ["error.accept", [...]], ["array.accept", [...]], etc
    const result = await target.Send([
      "target",
      [
        target.GetSelector(), // Example: "client"
        `${this.GetLocalName()}.${action}`, // Example: "user.insert"
        ...this.GetActions(),

        // // The rest of the recording, AKA ...this[ACTIONS]
        // "email",
        // ["=", "example@domain.com"],
        // "first_name",
        // ["=", "First"],
        // "last_name",
        // ["=", "Last"],
      ],
    ]);

    return target.Apply.apply(target, result);
  }

  SetOperation(name, operator = this.GetOperationOperator(name), value = this.GetOperationValue(name))
  {
    // Create an Operation to be the attribute's NODE_VALUE,
    // but use the value as the display string
    return this.SetAttribute(name, new Operation(operator, value), value);
  }

  GetOperationOperator(name)
  {
    const value = this.GetAttribute(name);
    if (value && value instanceof Operation)
    {
      return value.operator;
    }
  }

  GetOperationValue(name)
  {
    const value = this.GetAttribute(name);
    if (value && value instanceof Operation)
    {
      return value.value;
    }
  }

  SetObjectID(name, operator, value)
  {
    return this.SetOperation(name, operator, value);
  }

  OID(o, v){ return this.SetObjectID("_id", o, v); }
  GetOID(){ return this.GetOperationValue("_id"); }

  Action(action){ return this.SetAttribute("action", action); }
  GetAction(){ return this.GetAttribute("action"); }

  Target(target)
  {
    if (target instanceof Record)
    {
      target = target.GetSelector() ?? target.GetLocalName();
    }

    return this.SetAttribute("target", target);
  }

  GetTarget(){ return this.GetAttribute("target"); }

  GetActionSymbol()
  {
    switch (this.GetAction())
    {
      case "search": return this.constructor.Search;
      case "filter": return this.constructor.Filter;
      case "insert": return this.constructor.Insert;
      case "unsert": return this.constructor.Unsert;
      case "upsert": return this.constructor.Upsert;
      case "resert": return this.constructor.Resert;
      case "update": return this.constructor.Update;
      case "modify": return this.constructor.Modify;
      case "delete": return this.constructor.Delete;
      case "count" : return this.constructor.Count ;
      case "login" : return this.constructor.Login ;
      case "logout": return this.constructor.Logout;
      default: throw new Error(`Unknown action "${this.GetAction()}" in Model.GetActionSymbol`);
    }
  }

  Search(t){ return this.Action("search").Target(t).Send(t); }
  Filter(t){ return this.Action("filter").Target(t).Send(t); }
  Insert(t){ return this.Action("insert").Target(t).Send(t); }
  Unsert(t){ return this.Action("unsert").Target(t).Send(t); }
  Upsert(t){ return this.Action("upsert").Target(t).Send(t); }
  Resert(t){ return this.Action("resert").Target(t).Send(t); }
  Update(t){ return this.Action("update").Target(t).Send(t); }
  Modify(t){ return this.Action("modify").Target(t).Send(t); }
  Delete(t){ return this.Action("delete").Target(t).Send(t); }
  Count (t){ return this.Action("count" ).Target(t).Send(t); }
  Login (t){ return this.Action("login" ).Target(t).Send(t); }
  Logout(t){ return this.Action("logout").Target(t).Send(t); }

  Apply(action, args)
  {
    switch (action)
    {
      case "search": return this.Search(...args);
      default: return super.Apply(action, args);
    }
  }

  Access(symbol, tag)
  {
    switch (symbol)
    {
      // Logout is not a special or protected operation,
      // it just has to be called with the proper target
      case this.constructor.Logout:
      {
        this.Remove();
        return this;
      }
      default:
      {
        throw new Error(`No access is granted from symbol "${symbol}"`);
      }
    }
  }
}

export class Connection extends Record
{
  SessionID(o, v)
  {
    this.Assert(v).IsString().IsLongerThan(10).IsShorterThan(20);
    return this.SetString("session_id", o, v);
  }

  GetSessionID(){ return this.GetAttribute("session_id"); }

  Apply(action, args)
  {
    switch (action)
    {
      case "target": return this.Target(...args);

      case "client.accept": return new Client(args).Accept(this);

      default: return super.Apply(action, args);
    }
  }
}

export class Client extends Record
{
  SessionID(o, v)
  {
    this.Assert(v).IsString().IsShorterThan(100);
    return this.Save("session_id", o, v);
  }

  GetSessionID(){ return this.GetAttribute("session_id"); }

  Apply(action, args)
  {
    switch (action)
    {
      case "session_id": return this.SessionID(...args);

      case "client.accept": return new this.constructor(args).Accept(this);
      case "client.delete": return new this.constructor(args).Delete(this);

      case "user.login" : return new User(args).Login(this);
      case "user.accept": return new User(args).Accept(this);
      default: return super.Apply(action, args);
    }
  }
}
