import {Tag} from "/js/Tag.js";
import {Model} from "/js/Tags/Model.js";
import {Document} from "/js/Tags/Document.js";

// The default Client Model, used by the WebSocket's Connection
export class Client extends Model
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "client"; }

  static Seed(collection)
  {
    collection.CreateIndexes({
      session_id: 1,
    });

    return super.Seed(collection);
  }

  static async Get()
  {
    // const socket = await Socket.Get();
    return Document.Get().GetSocket().GetClient();
  }

  SessionID(o, v){ return this.SetString("session_id", o, v); }
  HTML(o, v){ return this.SetHTML("html", o, v); }

  _Search(owner)
  {
    if (owner instanceof this.constructor)
    {
      this.ID("==", owner._id);
    }
  }

  Apply(action, args)
  {
    switch (action)
    {
      case "session_id": return this.SessionID(...args);
      case "html": return this.HTML(...args);

      // Make sure a client can only interact with itself
      case "client.delete": return this.constructor.From(args).ID("==", this._id).Delete(this);
      case "client.search": return this.constructor.From(args).ID("==", this._id).Search(this);

      default: return super.Apply(action, args);
    }
  }
}
