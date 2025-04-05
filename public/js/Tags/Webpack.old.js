import {Tag} from "/js/Tag.js";

const PROMISE = import("/js/Tags/Webpack.js").then(m => m.Webpack.New()); // Singleton

export class Webpack extends Tag
{
  static Get(){ return PROMISE; }
  static GetLocalName(){ return "webpack"; }
  static GetMetaURL(){ return import.meta.url; }
}
