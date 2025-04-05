import {Tag} from "/js/Tag.js";
import {Buffer} from "/js/Buffer.js";
import {Codes} from "/js/Codes.js";

import {Connection as Base} from "/js/Tags/Connection.js?after=/taggly/private/";
// import {Base} from "/js/Tags/Connection/Base.js";
// import {Client} from "/js/Tags/Model/Client.js";

export class Connection extends Base
{
  #request;

  constructor(socket, request)
  {
    super(socket, request.GetCookie("session_id"));

    this.#request = request;
  }

  Close()
  {
    this.GetSocket().terminate();
    this.Remove();
    return this;
  }

  Ping(operation)
  {
    this.GetSocket().ping(operation);
    return this;
  }

  OnPongHandler()
  {
    this.GetSocket().alive = true;
  }

  OnMessageHandler(data)
  {
    // console.log("OnMessageHandler", data);

    return this.Receive(data);
  }

  async OnCloseHandler(code, reason)
  {
    this.Remove();
  }

  CreateReadyPromise()
  {
    return new Promise((resolve, reject) =>
    {
      try
      {
        const socket = this.GetSocket();

        socket.on("pong"   , this.OnPongHandler   .bind(this));
        socket.on("message", this.OnMessageHandler.bind(this));
        socket.on("close"  , this.OnCloseHandler  .bind(this));
  
        resolve();
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  CreateClient(){ return undefined; }

  GetIP(){ return this.#request.connection.remoteAddress; }
}

export class _Connection extends Base
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "connection"; }

  constructor(socket, request)
  {
    // console.log(request.GetCookie("session_id"));
    socket.binaryType = "arraybuffer";

    super(socket);

    this.request = request;
    this.alive = true;

    this.socket.on("pong"   , this.OnPongHandler   .bind(this));
    this.socket.on("message", this.OnMessageHandler.bind(this));
    this.socket.on("close"  , this.OnCloseHandler  .bind(this));
  }

  Close()
  {
    this.socket.terminate();
    return this;
  }

  Ping(operation)
  {
    this.socket.ping(operation);
    // new OnPing(this, operation).Sink();
    return this;
  }

  OnPongHandler()
  {
    this.socket.alive = true;
    // new OnPong(this).Sink();
  }

  OnMessageHandler(data)
  {
    // console.log("OnMessageHandler", data);

    return this.Receive(data);
  }

  async Receive(data)
  {
    let id;

    try
    {
      const [action, args, message_id] = await super.Receive(data);
      console.log("Received", action, args, message_id);
      id = message_id;

      this.Expect(action).Named("action").ToBeString();
      this.Expect(args).Named("args").ToBeArray();
      this.Expect(id).Named("id").ToBeNumber();

      // console.log("Received:", action, args);

      let actions = await this.Apply(action, args);
      // console.log(actions);

      if (actions instanceof Tag)
      {
        actions = actions.toJSON();
      }

      actions.push(id);
      return super.Send(actions);
    }
    catch (error)
    {
      console.error("CONNECTION_RECEIVE_ERROR:", error);
      return await this.Send(["error", [error.message], id]);
    }
  }

  _Call(method, ...args)
  {
    const codes = Codes();
    if (!codes.has(method))
    {
      throw new Error(`Cannot send method "${method.name}" because it does not have a code and isn't registered`);
    }
  
    const message_id = this.GetNextID();
  
    const buffer = new Buffer();
    const code = codes.get(method);
  
    buffer.WriteU16(message_id);
    buffer.WriteU16(code);
    buffer.WriteArray(args);
    
    this.SendBuffer(buffer);
  }

  async Receive(data)
  {
    let id;

    try
    {
      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data))
      {
        return this.ReceiveBuffer(data);
      }

      const [action, args, message_id] = await super.Receive(data);
      console.log("Received", action, args, message_id);
      id = message_id;

      this.Expect(action).Named("action").ToBeString();
      this.Expect(args).Named("args").ToBeArray();
      this.Expect(id).Named("id").ToBeNumber();

      // console.log("Received:", action, args);

      let actions = await this.Apply(action, args);
      // console.log(actions);

      if (actions instanceof Tag)
      {
        actions = actions.toJSON();
      }

      actions.push(id);
      return super.Send(actions);
    }
    catch (error)
    {
      console.error("CONNECTION_RECEIVE_ERROR:", error);
      return await this.Send(["error", [error.message], id]);
    }
  }

  async Send(id, array)
  {
    try
    {
      console.log("~SEND", id, array);
      return await super.Send(id, array);
    }
    catch (error)
    {
      console.error("CONNECTION_SEND_ERROR:", error);
      return await super.Send(id, error);
    }
  }

  async OnCloseHandler(code, reason)
  {
    this.Remove();
  }

  Target(selector, args)
  {
    let target = this;
    if (typeof(selector) === "string")
    {
      target = this.Query(selector);
      if (!target) throw new Error(`Failed to target a child of the owner with selector "${selector}"`);

      // This check should never actually pass, because of how querySelector works
      // but it's here for redundancy since it would be a security risk if a non-child were selected
      if (!this.Contains(target)) throw new Error(`Target is not a child of the connection`);
    }

    return target.Apply.apply(target, args);
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "target": return this.Target(...args);
      case "ping":
      {
        // console.log("Pong...");
        return ["pong", [Date.now() - args[0]]];
      }
      default: return super.Apply(action, args);
    }
  }

  GetIP(){ return this.request.connection.remoteAddress; }
}
