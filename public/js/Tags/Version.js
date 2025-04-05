import {Tag} from "/js/Tag.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Version extends Singleton
{
  Major(major){ return this.SetAttribute("major", major); }
  Minor(minor){ return this.SetAttribute("minor", minor); }
  Patch(patch){ return this.SetAttribute("patch", patch); }

  GetMajor(){ return this.GetAttributeNumber("major") || 0; }
  GetMinor(){ return this.GetAttributeNumber("minor") || 0; }
  GetPatch(){ return this.GetAttributeNumber("patch") || 0; }
  GetParts(){ return [this.GetMajor(), this.GetMinor(), this.GetPatch()]; }
  GetVersion(){ return `${this.GetMajor()}.${this.GetMinor()}.${this.GetPatch()}`; }
  toString(){ return this.GetVersion(); }
}
