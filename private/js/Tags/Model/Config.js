import {Tag} from "/js/Tag.js";
import {Model} from "/js/Tags/Model.js";

let instance;
export class Config extends Model
{
  static Get(){ return instance ??= new this().Search(); }

  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "config"; }

  PrivateKey(o, v){ return this.SetString("private_key", o, v); }
  Certificate(o, v){ return this.SetString("certificate", o, v); }

  GetPrivateKey(){ return this.private_key; }
  GetCertificate(){ return this.certificate; }
  HasPrivateKey(){ return !!this.private_key; }
  HasCertificate(){ return !!this.certificate; }

  Apply(action, args)
  {
    switch (action)
    {
      case "private_key": return this.PrivateKey(...args);
      case "certificate": return this.Certificate(...args);
      default: return super.Apply(action, args);
    }
  }
}
