// import {Tag} from "/js/Docs/Tag.js";
import {P} from "/js/Tags/P.js";
import {H2} from "/js/Tags/H2.js";
import {Boolean as BooleanTag} from "/js/Tags/Boolean.js";

export class Boolean extends Docs
{
  Reference(){ return BooleanTag; }
  Title(){ return H2.Add`Boolean`; }
  Subtitle(){ return H2.Add`A ${this.Tag} wrapper around a ${this.BooleanLiteral} literal`; }
}
