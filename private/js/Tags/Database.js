import "/flag#dangerous";

import {window} from "/js/Window.js";
import {Tag} from "/js/Tag.js";
import {Database as Base} from "/js/Tags/Database.js?after=/taggly/private/";
import {mongodb} from "/js/External/MongoDB.js";

import {Loader} from "/js/Loader.js";
const loader = Loader.Get();

const CREATE_MONGO_CLIENT = Symbol("create_mongo_client");

export class Database extends Base
{
  #db;
  #client;

  constructor(...args)
  {
    super(...args);

    // this.client = this.CreateClient();
    this.#db = this.CreateDatabase();
  }

  IsEnabled(){ return !!mongodb; }

  async GetURL()
  {
    const pkg = await loader.GetPackage();

    return pkg?.npm_config?.db?.url
        ?? pkg?.db?.url
        ?? "mongodb://127.0.0.1:27017/";
  }

  async GetUsername()
  {
    const pkg = await loader.GetPackage();

    return pkg?.npm_config?.db?.username
        ?? pkg?.db?.username;
  }

  async GetPassword()
  {
    const pkg = await loader.GetPackage();

    return pkg?.npm_config?.db?.password
        ?? pkg?.db?.password;
  }

  async GetName()
  {
    const pkg = await loader.GetPackage();

    const name = pkg?.npm_config?.db?.name ?? pkg?.name;

    if (!name) throw new Error("package.json should provide a database name or Database.GetName must be overridden");

    return name;
  }

  GetTimeout(){ return undefined; }

  async ImportCreateMongoClient()
  {
    const {StaticCreateMongoClient} = await import("/js/Tags/Database/StaticCreateMongoClient.js");
    return StaticCreateMongoClient;
  }

  async CreateDatabase()
  {
    const enabled = await this.IsEnabled();
    if (enabled !== true) return;

    let url = await this.GetURL();

    if (!(url instanceof URL))
    {
      url = new URL(url, window.location.origin);
    }

    const name = await this.GetName();
    const username = await this.GetUsername();
    const password = await this.GetPassword();
    const timeout = await this.GetTimeout();

    const CreateMongoClient = await this.ImportCreateMongoClient();

    return CreateMongoClient({
      url,
      name,
      username,
      password,
      timeout,
      loader,
    });
  }

  GetClient(){ return this.#client; }
  GetDB(){ return this.#db; }
  async GetMongoCollection(name){ return (await this.GetDB())?.collection(name); }

  async IsConnected()
  {
    const db = await this.GetDB();
    return !!db;
  }
}
