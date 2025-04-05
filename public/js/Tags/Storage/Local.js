import {Tag} from "/js/Tag.js";
import {Storage} from "/js/Tags/Storage.js";
import {Environment} from "/js/Utility/Environment.js";

// const PROMISE = import("/js/Tags/Storage/Local.js").then(m => m.Local.New()); // Singleton

export class Local extends Storage
{
  // static Get(){ return PROMISE; }
  static GetLocalName(){ return "local"; }
  static GetMetaURL(){ return import.meta.url; }

  CreateStorage()
  {
    if (this.IsStorageAvailable("localStorage"))
    {
      return window.localStorage;
    }
  }
}
