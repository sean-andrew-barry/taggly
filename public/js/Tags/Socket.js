import {Tag} from "/js/Tag.js";
import {Connection} from "/js/Tags/Connection.js";
import {Local} from "/js/Tags/Storage/Local.js";

// Client side WebSocket
export class Socket extends Tag
{
  static Get(){ throw new Error("Socket.Get invalid"); }
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "socket"; }

  #wss;
  #connection;

  constructor()
  {
    super();

    // this.#wss = this.CreateWSS();
    // this.#connection = this.CreateConnection();

    // Auto initialize these on construction
    this.GetWSS();
    this.GetConnection();
  }

  IsSecure(){ return window.location.protocol === "https:"; }
  GetHost(){ return window.location.host; }
  GetSocketUrl(){ return this.GetSocketURL(); }
  GetSocketURL(){ return `${this.IsSecure() ? "wss" : "ws"}://${this.GetHost()}`; }

  async GetSessionID()
  {
    const storage = await Local.Get();

    let session_id = "";
    if (storage.Has("session_id"))
    {
      session_id = storage.Get("session_id");
    }
    else
    {
      const array = new Uint32Array(6);
      window.crypto.getRandomValues(array);

      for (let i = 0; i < array.length; i++)
      {
        session_id += array[i].toString(16);
      }

      storage.Set("session_id", session_id);
    }

    return session_id;
  }

  async CreateWSS()
  {
    const url = await this.GetSocketURL();
    const protocol = await this.GetProtocol();
    
    const wss = new WebSocket(url, protocol);

    wss.binaryType = await this.GetBinaryType();

    return wss;
  }

  async CreateConnection()
  {
    const session_id = await this.GetSessionID();
    const wss = await this.GetWSS();

    const connection = new Connection(wss, session_id)
    .OnDisconnect(event =>
    {
      // console.log("Connection closed");
      this.#wss = undefined;
      this.#connection = undefined;
    });

    this.AppendChild(connection);

    return connection;
  }

  GetWSS(){ return this.#wss ??= this.CreateWSS(); }
  GetConnection(){ return this.#connection ??= this.CreateConnection(); }
  GetProtocol(){ return "protocolOne"; }
  GetBinaryType(){ return "arraybuffer"; }

  async GetClient()
  {
    const connection = await this.GetConnection();
    return connection.GetClient();
  }
}
