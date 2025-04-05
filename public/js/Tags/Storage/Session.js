import {Tag} from "/js/Tag.js";
import {Storage} from "/js/Tags/Storage.js";
import {Environment} from "/js/Utility/Environment.js";

// const PROMISE = import("/js/Tags/Storage/Session.js").then(m => m.Session.New()); // Singleton

export class Session extends Storage
{
  static GetLocalName(){ return "session"; }
  static GetMetaURL(){ return import.meta.url; }

  CreateStorage()
  {
    if (this.IsStorageAvailable("sessionStorage"))
    {
      return window.sessionStorage;
    }
  }
}
