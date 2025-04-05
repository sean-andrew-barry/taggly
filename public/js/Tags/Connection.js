import {Tag} from "/js/Tag.js";
import {Base} from "/js/Tags/Connection/Base.js";
import {Client} from "/js/Tags/Model/Client.js";
import {Buffer} from "/js/Buffer.js";
import {Codes} from "/js/Codes.js";

export class Connection extends Tag
{
  static GetLocalName(){ return "connection"; }

  constructor(socket, session_id)
  {
    super();

    socket.binaryType = "arraybuffer";

    this.#socket = socket;
    this.#session_id = session_id;
    this.#ready_promise = this.CreateReadyPromise();
    this.#client = this.CreateClient();
  }

  #socket;
  #session_id;
  #ready_promise;
  #client;
  #messages_sent = 0;
  #messages_received = 0;
  #bytes_sent = 0;
  #bytes_received = 0;
  #promises = new Map();

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
    console.log("Socket closed!", event, this.#socket);
    // setTimeout(() =>
    // {
    //   this.Reconnect();
    //   // this.promise.catch(error =>
    //   // {
    //   //   // console.log("Caught...", error);
    //   // });
    // }, 1000);
  }

  OnMessageHandler(event)
  {
    return this.Receive(event.data);
  }

  CreateReadyPromise()
  {
    return new Promise((resolve, reject) =>
    {
      // this.#socket.onmessage = this.OnMessageHandler.bind(this);
      // this.#socket.onopen = this.OnOpenHandler.bind(this, resolve);
      // this.#socket.onerror = this.OnErrorHandler.bind(this, reject);
      // this.#socket.onclose = this.OnCloseHandler.bind(this);

      this.#socket.addEventListener("message", event =>
      {
        this.OnMessageHandler(event);
      });

      this.#socket.addEventListener("open", event =>
      {
        this.OnOpenHandler(resolve, event);
      });

      this.#socket.addEventListener("error", event =>
      {
        this.OnErrorHandler(reject, event);
      });

      this.#socket.addEventListener("close", event =>
      {
        this.OnCloseHandler(event);
      });
    });
  }

  async CreateClient()
  {
    const client = await new Client().SessionID("==", this.GetSessionID()).Login(this);

    if (client)
    {
      // this.AppendChild(client);
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

  async CreateClient()
  {
    const client = await new Client().SessionID("==", this.GetSessionID()).Test(this);
    // const client = await new Client().SessionID("==", "").Test(this);

    if (client)
    {
      // this.AppendChild(client);
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

  async Receive(data)
  {
    try
    {
      this.#messages_received += 1;

      if (typeof(data) === "string")
      {
        this.#bytes_received += data.length;
  
        return JSON.parse(data);
      }
      else if (data instanceof ArrayBuffer)
      {
        this.#bytes_received += data.byteLength;
        console.log("Received", data.byteLength, "bytes");
  
        const buffer = new Buffer(data);
        const message_id = buffer.ReadMessageID();
    
        if (this.#promises.has(message_id))
        {
          const promise = this.#promises.get(message_id);
          this.#promises.delete(message_id);
          
          const value = buffer.Read();

          // console.log("Received", message_id, value);

          if (value instanceof globalThis.Error)
          {
            promise.reject(value);
          }
          else
          {
            promise.resolve(value);
          }
    
          return;
        }
        else
        {
          const value = buffer.Read();
          // console.log("Received", message_id, value);
    
          const reply = new Buffer();
          reply.WriteMessageID(message_id);
    
          try
          {
            if (typeof(value) !== "function")
            {
              throw new Error(`Expected buffer value to be a function, but got "${typeof(value)}"`);
            }

            const result = await value.call(this);
            reply.Write(result);
          }
          catch (error)
          {
            console.error(error);
            reply.Write(error);
          }
          finally
          {
            this.Send(reply);
          }
        }
      }
    }
    catch (error)
    {
      console.error(`Unexpected Connection error`, error);
    }
  }

  async Send(buffer)
  {
    await this.GetReadyPromise();

    this.#messages_sent += 1;

    buffer.Shrink();
    this.#socket.send(buffer.GetBuffer());
  }

  Call(fn, ...args)
  {
    return new Promise(async (resolve, reject) =>
    {
      try
      {
        // const message_id = this.GetNextID();
        const message_id = this.#messages_sent++;

        this.#promises.set(message_id, {
          resolve,
          reject,
          time: Date.now(),
        });
  
        if (!Codes.HasInstance(fn))
        {
          throw new Error(`Cannot send function "${fn.name}" because it does not have a code and isn't registered`);
        }
  
        const buffer = new Buffer();
  
        buffer.WriteMessageID(message_id);
        buffer.Write(fn, ...args);
  
        await this.Send(buffer);
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  GetID(){ return; }
  GetSocket(){ return this.#socket; }
  GetSessionID(){ return this.#session_id; }
  GetMessagesSent(){ return this.#messages_sent; }
  GetMessagesReceived(){ return this.#messages_received; }
  GetBytesSent(){ return this.#bytes_sent; }
  GetBytesReceived(){ return this.#bytes_received; }
  GetReadyPromise(){ return this.#ready_promise; }
  // GetProtocol(){ return this.#socket.protocol || "protocolOne"; }
  // GetURL(){ return this.#socket.url; }
  GetTimeout(){ return 1000; }

  // Socket has been created. The connection is not yet open.
  IsConnecting(){ return this.#socket.readyState === 0; }

  // The connection is open and ready to communicate.
  IsOpen(){ return this.#socket.readyState === 1; }

  // The connection is in the process of closing.
  IsClosing(){ return this.#socket.readyState === 2; }

  // The connection is closed or couldn't be opened.
  IsClosed(){ return this.#socket.readyState === 3; }

  GetClient(){ console.warn("Get Client?"); return this.client; }

  QueryOwner(id)
  {
    console.log("Querying owner from", id);
    // if (!id) return this;

    if (typeof(id) === "string")
    {
      return this.Query(`#${id}`);
    }
    else
    {
      return this;
    }
  }
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
