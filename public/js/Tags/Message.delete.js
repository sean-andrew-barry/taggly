import {Tag} from "/js/Tag.js";

export const MAP = Symbol("map");
export const INDEX = Symbol("index");
export const ACTIONS = Symbol("actions");

export class Message extends Tag
{
  static GetMap(){ return this[MAP]; }
  static SetMap(v){ this[MAP] = v; return this; }

  static GetNextIndex(){ return Message[INDEX]++; }

  static Register(map)
  {
    this.SetMap(map);
    return super.Register();
  }

  static async Load(type, index, ...actions)
  {
    const message = Tag[type]();
    // message.GetActions().push(type, index);

    // message.SetIndex(index);

    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i + 0];
      const params = actions[i + 1];

      console.log(i, "applying", action, params);

      message = await message.Call(action, params);
    }

    return message;
  }

  // constructor(node, connection, index = this.constructor.GetNextIndex())
  // {
  //   super(node);
  //
  //   if (global.IsServer())
  //   {
  //
  //   }
  //   else
  //   {
  //
  //   }
  //   this.SetActions([]);
  //   // this.Record(this.constructor.name);
  // }

  GetActions(){ return this[ACTIONS] || (this[ACTIONS] = []); }
  SetActions(v){ this[ACTIONS] = v; return this; }

  GetIndex(){ return this[INDEX]; }
  SetIndex(v){ this[INDEX] = v; return this; }

  GetMappedAction(action)
  {
    let current = this.constructor;
    while (current && current !== Tag)
    {
      const map = current.GetMap();

      if (map.hasOwnProperty(action))
      {
        console.log("Found mapped action for", action);
        return map[action];
      }
      else
      {
        current = current.GetParent();
      }
    }
  }

  Call(action, args)
  {
    const mapped = this.GetMappedAction(action);
    if (!mapped) throw new Error(`Illegal action "${action}"`);

    const fn = this[mapped];

    if (typeof(fn) !== "function") throw new Error(`No function is defined for mapped action "${action}": "${mapped}"`);

    return fn.apply(this, args);
  }

  async Apply(actions)
  {
    let message = this;
    for (let i = 0; i < actions.length; i += 2)
    {
      const action = actions[i + 0];
      const params = actions[i + 1];

      console.log(i, "applying", action, params);

      message = await message.Call(action, params);
    }

    return message;
  }

  async Receive(data)
  {
    console.log("Message Received", data);
  }

  async Send()
  {
    const config = Tag.Query("config");
    const socket = await config.GetSocket().Wait();
    const connection = socket.GetConnection();

    // const socket = await global.app.config.GetSocket().Wait();
    // const connection = socket.GetConnection();

    // this.GetActions().push(this.constructor.name);

    return connection.Send(this);
  }

  Set(key, value)
  {
    if (this[key] === undefined)
    {
      this[key] = value;
    }

    return this;
  }

  AddAction(name, args)
  {
    const actions = this.GetActions();
    actions.push(name, args);

    return this;
  }

  Record(name, ...args)
  {
    const actions = this.GetActions();
    actions.push(name, args);

    return this;
  }

  Index(o, v){ return this.SetAttribute("index", v); }
  Action(o, v){ return this.SetAttribute("action", v); }
  Owner(o, v){ return this.SetAttribute("owner", v); }
}

Message[INDEX] = 0;
Message.Register({
  index: "Index",
  action: "Action",
  owner: "Owner",
});
