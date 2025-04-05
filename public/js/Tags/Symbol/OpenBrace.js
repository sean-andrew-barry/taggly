import {Symbol} from "/js/Tags/Symbol.js";

export class OpenBrace extends Symbol { Parse(p){ return p.Read("<") } }
