import {Tag} from "/js/Tag.js";
import {Connection} from "/js/Tags/Connection.js";
import {Environment} from "/js/Utility/Environment.js";

export class DeveloperConnection extends Connection
{
  async OnClose(code, reason)
  {
    await super.OnClose(code, reason);

    const socket = await Tag.Socket().Wait();

    // If it's the last connection in development mode
    if (socket.GetConnectionCount() === 0)
    {
      const loader = Environment.GetLoader();
      await loader.Reload();
    }
  }
}
