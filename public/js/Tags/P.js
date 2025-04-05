import {Tag} from "/js/Tag.js";

export class P extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "p"; }
}

// export {Paragraph as P};
