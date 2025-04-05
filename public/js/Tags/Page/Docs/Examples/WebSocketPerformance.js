// import {Function} from "/js/Tags/Function/Profile.js";
import {Tag} from "/js/Tag.js";
import {Profile} from "/js/Tags/Function/Profile.js";
import {Div} from "/js/Tags/Div.js";
import {Server} from "/js/Tags/Server.js";
import {Client} from "/js/Tags/Model/Client.js";
import {Environment} from "/js/Environment.js";

Environment.DepreciateFile(import.meta.url);

export async function WebSocketPerformance(fn)
{
  const connection = Tag.Query("connection");
  // const server = Tag.Query("server");

  const client = await connection.GetClient();

  const actions = [
    "ping",
    [
      window.Date.now(),
    ],
  ];

  fn.Add(
    new Profile().Client().Name("WebSocket").Duration(1000).Value(p =>
    {
      return connection.Send(actions);
    }),

    new Profile().Client().Name("HTTP").Async().Duration(1000).Value(async p =>
    {
      return fetch("/action", {
        method: "POST",
        body: JSON.stringify(actions),
      })
      .then(response => response.json());
    }),
  );
};
