import {Database as Private} from "/js/Tags/Database.js?after=/taggly/sandbox/";
import {Database as Public} from "/js/Tags/Database.js?after=/taggly/private/";
import {Environment} from "/js/Environment.js";

// If untrusted code is running, how can it be forced to use a specific database
// and not attempt to access any other databases?

export class Database extends Public
{
  #database;

  constructor(...args)
  {
    super(...args);
    console.log("Pseudo constructing sandboxed database");
  }

  GetTimeout(){ return undefined; }
  GetClient(){ return; } // Doesn't work in the sandbox
  GetDB(){ return; } // Doesn't work in the sandbox

  GetMongoCollection(name){ return this.#database.GetMongoCollection(name); }
  IsConnected(){ return this.#database.IsConnected(); }
}
