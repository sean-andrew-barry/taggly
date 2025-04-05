import "/flag#static";
import "/flag#dangerous";

import {WS as WebSocket} from "/js/External/WS.js";
import {console} from "/js/Console.js";
import {Loader} from "/js/Loader.js";

const loader = Loader.Get();

// TODO: Should this depend directly on the StaticCreateServer file?
// That seems weird, but it may be how it would reload properly...

let prev_listener;
let prev_server;
let socket;
export async function StaticCreateSocket({
  server,
  noServer = false,
  listener,
})
{
  if (!server && noServer !== true) throw new Error(`StaticCreateSocket must be given a server`);

  if (!socket)
  {
    socket = new WebSocket.Server({
      server,
      noServer,
    });

    loader.Destructor(import.meta.url, () =>
    {
      console.log("Destructing socket");
      // socket?.destroy?.();
      socket.close();
    });
  }
  else
  {
    // console.log("Simply updating socket listener", server);
    socket.removeListener("connection", prev_listener);

    // If the server has changed
    if (prev_server && prev_server !== server)
    {
      console.log("Server changed! Rebuilding socket with new server");

      // Destroy the old socket
      socket.close();

      // And rebuild it with the new server
      socket = new WebSocket.Server({
        server,
        noServer,
      });
    }
  }

  socket.on("connection", listener);
  prev_listener = listener;
  prev_server = server;

  return socket;
}
