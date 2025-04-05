import {Tag} from "/js/Tag.js";
import {Connection as Base} from "/js/Tags/Connection.js?after=/taggly/private/";
// import {Base} from "/js/Tags/Connection/Base.js";
import {Client} from "/js/Tags/Model/Client.js";

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

  GetIP(){ return this.#request.connection.remoteAddress; }
}

export class _Connection extends Base
{
  constructor(socket, session_id)
  {
    socket.binaryType = "arraybuffer";

    super(socket);

    this.session_id = session_id;
    this.start = performance.now();
    this.url = socket.url;
    this.protocol = socket.protocol || "protocolOne";
    this.callbacks = {};

    this.promise = new Promise((resolve, reject) =>
    {
      this.socket.onmessage = this.OnMessageHandler.bind(this);
      this.socket.onopen = this.OnOpenHandler.bind(this, resolve);
      this.socket.onerror = this.OnErrorHandler.bind(this, reject);
      this.socket.onclose = this.OnCloseHandler.bind(this);
    });

    this.timeout = 1000;
    this.timeout_id = setTimeout(() =>
    {
      console.error(`Socket timed out after`, this.timeout, "ms");
    }, this.timeout);

    this.client = this.CreateClient();

    // // TODO: Support automatic closing and reopening of connections based on browser visibility
    // document.addEventListener("visibilitychange", function(event)
    // {
    //   // console.log("visibilitychange", event);
    //   if (document.visibilityState === "visible")
    //   {
    //     // console.log("Visible");
    //   }
    //   else
    //   {
    //     // console.log("Hidden");
    //   }
    // });
  }

  async CreateClient()
  {
    const client = await new Client().SessionID("==", this.session_id).Login(this, null);

    if (client)
    {
      this.AppendChild(client);
      if (client.html)
      {
        client.ApplyHTML(client.html);
      }
      console.log("Logging in to client", client.GetNode());
    }
    else
    {
      console.log("Failed to log in to client", client);
    }

    return client;
  }

  Reconnect()
  {
    this.start = performance.now();
    this.socket = new WebSocket(this.url, this.protocol);

    this.promise = new Promise((resolve, reject) =>
    {
      this.socket.onmessage = this.OnMessage.bind(this);
      this.socket.onopen = this.OnOpen.bind(this, resolve);
      this.socket.onerror = this.OnError.bind(this, reject);
      this.socket.onclose = this.OnClose.bind(this);
    });
  }

  OnOpenHandler(resolve, event)
  {
    window.clearTimeout(this.timeout_id);
    // console.log("OnOpen", event);
    resolve(this);

    const end = performance.now();
    console.log("Socket opened!", end - this.start);
    // new OnOpen(this, event).Sink();
  }

  OnErrorHandler(reject, event)
  {
    window.clearTimeout(this.timeout_id);
    // console.log("OnError", event);
    // const end = performance.now();
    // console.error("Socket errored!", event, end - this.start);
    reject(this);
    // new OnError(this, event).Sink();
  }

  OnCloseHandler(event)
  {
    this.FireEvent("OnClose");
    // window.location.reload();

    // console.log("OnClose", event);
    // console.log("Socket closed!", event, this.socket);
    setTimeout(() =>
    {
      this.Reconnect();
      // this.promise.catch(error =>
      // {
      //   // console.log("Caught...", error);
      // });
    }, 1000);
  }

  OnMessageHandler(html)
  {
    // console.log("OnMessage", html);
    // new OnMessage(this, html).Sink();
    return this.Receive(html);
  }

  // async Send(tag)
  // {
  //   await this.promise;
  //
  //   return new Promise((resolve, reject) =>
  //   {
  //     const id = this.GetNextID();
  //     this.callbacks[id] = resolve;
  //     return super.Send(id, tag);
  //   });
  // }
  //
  // async Send(tag)
  // {
  //   await this.promise;
  //
  //   return new Promise((resolve, reject) =>
  //   {
  //     const id = this.GetNextID();
  //     this.callbacks[id] = resolve;
  //     return super.Send(id, tag);
  //   });
  // }

  Send(array)
  {
    return new Promise(async (resolve, reject) =>
    {
      await this.promise;

      const id = this.GetNextID();
      // array.push("key", [id]);
      this.callbacks[id] = resolve;
      return super.Send(id, array);
    });
  }

  async Receive(event)
  {
    try
    {
      const [action, args, id] = await super.Receive(event.data);
      // console.log("Received", action, args, id);

      this.Expect(action).Named("action").ToBeString();
      this.Expect(args).Named("args").ToBeArray();
      this.Expect(id).Named("id").ToBeNumber();

      const result = await this.Apply(action, args);

      const callback = this.callbacks[id];
      if (callback)
      {
        delete this.callbacks[id];
        callback(result.Deconvert());
      }
    }
    catch (error)
    {
      console.error(error);
    }
  }

  ConnectionReceiveError(json)
  {
    console.log("ConnectionReceiveError", json);
    return this;
  }

  ConnectionSendError(json)
  {
    console.log("ConnectionSendError", json);
    return this;
  }

  New(type, args)
  {
    const ctor = this.constructor.GetType(type);
    if (!ctor) throw new Error(`Unknown new type of "${type}"`);

    return new ctor(args);
  }

  Apply(action, args)
  {
    // console.log("Connection.Apply", );
    switch (action)
    {
      case "connection_receive_error": return this.ConnectionReceiveError(...args);
      case "connection_send_error": return this.ConnectionSendError(...args);
      case "new": return this.New(...args);
      case "construct": return this.Construct(...args);
      default: return super.Apply(action, args);
    }
  }

  // Socket has been created. The connection is not yet open.
  IsConnecting(){ return this.socket.readyState === 0; }

  // The connection is open and ready to communicate.
  IsOpen(){ return this.socket.readyState === 1; }

  // The connection is in the process of closing.
  IsClosing(){ return this.socket.readyState === 2; }

  // The connection is closed or couldn't be opened.
  IsClosed(){ return this.socket.readyState === 3; }

  GetClient(){ return this.client; }
}

export class _Connection extends Base
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "connection"; }

  constructor(socket, session_id)
  {
    socket.binaryType = "arraybuffer";

    super(socket);

    this.session_id = session_id;
    this.start = performance.now();
    this.url = socket.url;
    this.protocol = socket.protocol || "protocolOne";
    this.callbacks = {};
    this.timeout = 1000;

    this.promise = new Promise((resolve, reject) =>
    {
      this.socket.onmessage = this.OnMessageHandler.bind(this);
      this.socket.onopen = this.OnOpenHandler.bind(this, resolve);
      this.socket.onerror = this.OnErrorHandler.bind(this, reject);
      this.socket.onclose = this.OnCloseHandler.bind(this);
    });

    // this.timeout_id = setTimeout(() =>
    // {
    //   console.error(`Socket timed out after`, this.timeout, "ms");
    // }, this.timeout);

    // this.socket = this.CreateSocket();
    this.client = this.CreateClient();

    // window.addEventListener("beforeunload", event =>
    // {
    //   console.log("Unload, closing socket");
    //   socket.close();
    // });

    // // TODO: Support automatic closing and reopening of connections based on browser visibility
    // document.addEventListener("visibilitychange", function(event)
    // {
    //   // console.log("visibilitychange", event);
    //   if (document.visibilityState === "visible")
    //   {
    //     // console.log("Visible");
    //   }
    //   else
    //   {
    //     // console.log("Hidden");
    //   }
    // });
  }

  // Wait()
  // {
  //   return this.socket;
  // }
  //
  // async CreateSocket()
  // {
  //   await super.Wait();
  //
  //   const promise = new Promise((resolve, reject) =>
  //   {
  //     this.socket.onmessage = this.OnMessageHandler.bind(this);
  //     this.socket.onopen = this.OnOpenHandler.bind(this, resolve);
  //     this.socket.onerror = this.OnErrorHandler.bind(this, reject);
  //     this.socket.onclose = this.OnCloseHandler.bind(this);
  //   });
  //
  //   this.timeout_id = setTimeout(() =>
  //   {
  //     console.error(`Socket timed out after`, this.timeout, "ms");
  //   }, this.timeout);
  //
  //   return promise;
  // }

  async CreateClient()
  {
    const client = await new Client().SessionID("==", this.session_id).Login(this, null);

    if (client)
    {
      this.AppendChild(client);
      if (client.html)
      {
        client.ApplyHTML(client.html);
      }
      console.log("Logging in to client", client.GetNode());
    }
    else
    {
      console.log("Failed to log in to client", client);
    }

    return client;
  }

  Reconnect()
  {
    this.start = performance.now();
    this.socket = new WebSocket(this.url, this.protocol);

    this.promise = new Promise((resolve, reject) =>
    {
      this.socket.onmessage = this.OnMessage.bind(this);
      this.socket.onopen = this.OnOpen.bind(this, resolve);
      this.socket.onerror = this.OnError.bind(this, reject);
      this.socket.onclose = this.OnClose.bind(this);
    });
  }

  OnOpenHandler(resolve, event)
  {
    if (this.timeout_id)
    {
      window.clearTimeout(this.timeout_id);
    }

    // console.log("OnOpen", event);
    resolve(this);

    const end = performance.now();
    // console.log("Socket opened!", end - this.start);
    // new OnOpen(this, event).Sink();
  }

  OnErrorHandler(reject, event)
  {
    if (this.timeout_id)
    {
      window.clearTimeout(this.timeout_id);
    }

    // console.log("OnError", event);
    // const end = performance.now();
    // console.error("Socket errored!", event, end - this.start);
    reject(this);
    this.Remove();
    // new OnError(this, event).Sink();
  }

  OnCloseHandler(event)
  {
    // this.FireEvent("OnClose");
    // window.location.reload();

    this.Remove();

    // console.log("OnClose", event);
    console.log("Socket closed!", event, this.socket);
    // setTimeout(() =>
    // {
    //   this.Reconnect();
    //   // this.promise.catch(error =>
    //   // {
    //   //   // console.log("Caught...", error);
    //   // });
    // }, 1000);
  }

  OnMessageHandler(html)
  {
    // console.log("OnMessage", html);
    // new OnMessage(this, html).Sink();
    return this.Receive(html);
  }

  Send(array)
  {
    return new Promise(async (resolve, reject) =>
    {
      await this.promise;

      array = array.slice(0);

      const id = this.GetNextID();
      array.push(id);
      this.callbacks[id] = resolve;
      // console.log("Sending", id, array);
      return super.Send(array);
    });
  }

  async Receive(event)
  {
    try
    {
      const [action, args, id] = await super.Receive(event.data);
      console.log("Received", action, args, id);

      this.Expect(action).Named("action").ToBeString();
      this.Expect(args).Named("args").ToBeArray();
      this.Expect(id).Named("id").ToBeNumber();

      const result = await this.Apply(action, args);

      const callback = this.callbacks[id];
      if (callback)
      {
        delete this.callbacks[id];
        callback(result.Deconvert());
      }
    }
    catch (error)
    {
      console.error(error);
    }
  }

  async Receive(event)
  {
    try
    {
      if (event.data instanceof ArrayBuffer || ArrayBuffer.isView(event.data))
      {
        return this.ReceiveBuffer(event.data);
      }

      const [action, args, id] = await super.Receive(event.data);
      console.log("Received", action, args, id);

      this.Expect(action).Named("action").ToBeString();
      this.Expect(args).Named("args").ToBeArray();
      this.Expect(id).Named("id").ToBeNumber();

      // const result = await this.Apply(action, args);

      const callback = this.callbacks[id];
      if (callback)
      {
        delete this.callbacks[id];
        callback([action, args]);
      }
      else
      {
        console.warn("No callback for", id);
      }
    }
    catch (error)
    {
      console.error(error);
    }
  }

  #promises = new Map();

  _Call(fn, ...args)
  {
    return new Promise(async (resolve, reject) =>
    {
      await this.promise;

      const id = this.GetNextID();
      this.#promises.set(id, (value) =>
      {
        console.log("Resolved!", value);
        resolve(value);
      });

      const codes = Codes();
      if (!codes.has(fn))
      {
        throw new Error(`Cannot send function "${fn.name}" because it does not have a code and isn't registered`);
      }
    
      const buffer = new Buffer();
      // const code = codes.get(fn);
    
      buffer.WriteU16(id);
      // buffer.WriteCode(code);
      // buffer.WriteArray(args);
      buffer.WriteFunction(fn, ...args);

      this.SendBuffer(buffer);
    });
  }

  ConnectionReceiveError(json)
  {
    console.log("ConnectionReceiveError", json);
    return this;
  }

  ConnectionSendError(json)
  {
    console.log("ConnectionSendError", json);
    return this;
  }

  New(type, args)
  {
    const ctor = this.constructor.GetType(type);
    if (!ctor) throw new Error(`Unknown new type of "${type}"`);

    return new ctor(args);
  }

  Apply(action, args)
  {
    // console.log("Connection.Apply", );
    switch (action)
    {
      case "connection_receive_error": return this.ConnectionReceiveError(...args);
      case "connection_send_error": return this.ConnectionSendError(...args);
      case "new": return this.New(...args);
      case "construct": return this.Construct(...args);
      default: return super.Apply(action, args);
    }
  }

  // Socket has been created. The connection is not yet open.
  IsConnecting(){ return this.socket.readyState === 0; }

  // The connection is open and ready to communicate.
  IsOpen(){ return this.socket.readyState === 1; }

  // The connection is in the process of closing.
  IsClosing(){ return this.socket.readyState === 2; }

  // The connection is closed or couldn't be opened.
  IsClosed(){ return this.socket.readyState === 3; }

  GetClient(){ return this.client; }
}
