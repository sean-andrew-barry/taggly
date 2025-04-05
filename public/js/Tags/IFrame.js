import {Tag} from "/js/Tag.js";

export class IFrame extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "iframe"; }

  // constructor(...args)
  // {
  //   super(...args);
  //   if (Environment.IsInlineFrame())
  //   {
  //     console.log("Not loading iframe inside of iframe");
  //     return undefined;
  //   }
  // }
}
