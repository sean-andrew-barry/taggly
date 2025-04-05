import {Tag} from "/js/Tag.js";
import {SVG} from "/js/Tags/SVG.js";

export class Path extends SVG
{
  static GetLocalName(){ return "path"; }
  static GetMetaURL(){ return import.meta.url; }

  Fill(fill){ return this.SetAttribute("fill", fill); }

  toBinary()
  {
    console.log("Converting path to binary");
    const ctor = Tag.Constructor(this.constructor);
    return new Buffer().WriteU32(ctor.GetHash());
  }
}
