import "/flag#static";
import "/flag#frozen";
import "/flag#dangerous";

import {mongodb} from "/js/External/MongoDB.js";
import {console} from "/js/Console.js";

async function Create({
  url,
  name,
  username,
  password,
  timeout,
  use_new_url_parser,
  use_unified_topology,
})
{
  const start = performance.now();

  if (!(url instanceof URL))
  {
    throw new Error(`Expected parameter "url" to be a URL instance`);
  }

  if (username) url.username = username;
  if (password) url.password = password;

  // NOTE: I'm using Object.create here because it seems that mongodb
  // does not use hasOwnProperty when iterating the options and throws
  // an error at any unknown option, including those on the Object prototype.
  // It seems rather clumsy of them, but oh well.
  const options = Object.create(null);
  options.useNewUrlParser = use_new_url_parser ?? true;
  options.useUnifiedTopology = use_unified_topology ?? true;

  const client = new mongodb.MongoClient(url.href, options);

  return new Promise((resolve, reject) =>
  {
    client.connect(async error =>
    {
      if (error) return reject(error);

      const db = await client.db(name);
      const end = performance.now();

      console.log(`Connected to database`, console.YellowBright(name), "after", Math.floor((end - start) * 100) / 100, "ms");

      return resolve(db);
    });
  });
}

let client;
export function StaticCreateMongoClient(options)
{
  if (options.reload === true)
  {
    client = undefined;
  }

  return client ??= Create(options);
}
