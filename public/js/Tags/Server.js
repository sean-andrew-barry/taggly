import {Tag} from "/js/Tag.js";

export class Server extends Tag
{
  static Get(){ throw new Error("Server.Get invalid"); }
  static GetLocalName(){ return "server"; }
  static GetMetaURL(){ return import.meta.url; }
}
