import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Mailer extends Tag
{
  static GetLocalName(){ return "mailer"; }
  static GetMetaURL(){ return import.meta.url; }
}
