import {Tag} from "/js/Tag.js";
import {Promise} from "/js/Promise.js";

const INSTANCE = Symbol("instance");

export class Singleton extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "singleton"; }

  static GetInstanceSymbol(){ return INSTANCE; }
  static New(...args){ return new this(...args); }

  static Get(){ return this[INSTANCE] ??= this.New(); }
  static GetAsync(){ return Promise.Loaded().then(() => this.Get()); }
}
