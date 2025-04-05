import {Tag} from "/js/Tag.js";

export class Worker extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "worker"; }
  
  // SetNode(node)
  // {
  //   const result = super.SetNode(node);
  //   this.worker ??= new global.Worker("/js/Tags/Worker/Sandbox.js", { type: "module" });
  //
  //   return result;
  // }

  Timeout(timeout){ return this.SetAttribute("timeout", timeout); }
}
