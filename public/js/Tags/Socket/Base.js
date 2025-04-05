import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";
import {Connection} from "/js/Tags/Connection.js";

export const CONNECTION = Symbol("connection");

// The base for both the client and server side WebSocket implementations
export class Base extends Singleton
{
  static GetLocalName(){ return "socket"; }
  static GetMetaURL(){ return import.meta.url; }

  #connection;

  SetConnection(v){ return this.#connection = v; }
  GetConnection(){ return this.#connection; }
  // SetConnection(v){ return this[CONNECTION] = v; }
  // GetConnection(){ return this[CONNECTION]; }
}
