import {Socket as Base} from "/js/Tags/Socket.js?after=/taggly/private/";
import {Connection} from "/js/Tags/Connection.js";
import {Server} from "/js/Tags/Server.js";
import {StaticCreateSocket} from "/js/Tags/Socket/StaticCreateSocket.js";
import {Request} from "/js/Utility/Request.js";

export class Socket extends Base
{
  constructor(...args)
  {
    super(...args);
  }

  async CreateWSS()
  {
    const server = await this.GetServer();
    if (!server) throw new Error(`Cannot get secure WebSocket server because there is no HTTPS server`);

    return StaticCreateSocket({
      server: await server.GetServer(),
      listener: this.OnConnection.bind(this),
    });
  }

  async CreateConnection()
  {
  }

  async OnConnection(ws, request)
  {
    this.Add(
      new Connection(ws, new Request(request))
      .OnDisconnect(event =>
      {
        console.log("Connection closed");
      }),
    );
  }

  GetServer(){ return this.GetDocument().GetServer(); }
  GetConnectionCount(){ return this.GetWSS().then(wss => wss.clients.size); }
  // GetFirstConnection(){ return this.wss.clients.values().next().value[CONNECTION]; }
  GetFirstConnection(){ return this.GetFirstChild(); }
}
