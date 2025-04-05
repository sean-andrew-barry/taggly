import {Tag} from "/js/Tag.js";

export class Database extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "database"; }

  CreateClient(){ throw new Error("Database.CreateClient must be overridden"); }
  CreateDB(){ throw new Error("Database.CreateDB must be overridden"); }

  async _CreateDB(config, {
    // name = config.GetDatabaseName(),
  })
  {
    await this.Wait();

    if (!window.indexedDB) return;

    return new Promise((resolve, reject) =>
    {
      const request = window.indexedDB.open("test", 1);

      request.onsuccess = function(event)
      {
        resolve(event.target.result);
      };

      request.onerror = function(event)
      {
        reject(event.target.error);
      };

      request.onupgradeneeded = function(event)
      {
        const db = event.target.result;
        const store = db.createObjectStore("products", { keyPath: "_id" });

        store.createIndex("products_id_unqiue", "_id", { unique: true });
      };
    });
  }
}
