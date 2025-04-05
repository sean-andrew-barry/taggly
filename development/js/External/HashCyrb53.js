export * from "/js/External/HashCyrb53.js?after=/taggly/development/";
import {Cyrb as Base} from "/js/External/HashCyrb53.js?after=/taggly/development/";

import {Expect} from "/js/Expect.js";
import {Test} from "/js/Test.js";

const module = Expect.Module(import.meta);

export class Cyrb extends Base
{
  static #class = module.Class(this);
  static #Hash32 = this.#class.Function(super.Hash32);
  static #Hash53 = this.#class.Function(super.Hash53);

  static Hash32(data, seed, stride)
  {
    this.#Hash32.Parameter(data).Named("data").ToBeStringOrView();
    this.#Hash32.Parameter(seed).Named("seed").ToBeOptionalNumber();
    this.#Hash32.Parameter(stride).Named("stride").ToBeOptionalNumber();
  
    return super.Hash32(data, seed, stride);
  }
  
  static Hash53(data, seed, stride)
  {
    this.#Hash53.Parameter(data).Named("data").ToBeStringOrView();
    this.#Hash53.Parameter(seed).Named("seed").ToBeOptionalNumber();
    this.#Hash53.Parameter(stride).Named("stride").ToBeOptionalNumber();
  
    return super.Hash53(data, seed, stride);
  }
}

