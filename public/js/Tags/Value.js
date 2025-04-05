import {Tag} from "/js/Tag.js";
import {Array} from "/js/Tags/Array.js";
import {Object} from "/js/Tags/Object.js";
import {Promise} from "/js/Tags/Promise.js";
import {Date} from "/js/Tags/Date.js";
import {String} from "/js/Tags/String.js";
import {Number} from "/js/Tags/Number.js";
import {Error} from "/js/Tags/Error.js";
import {Null} from "/js/Tags/Null.js";
import {Boolean} from "/js/Tags/Boolean.js";

export class Value extends Tag
{
  static GetNodeName(){ return "value"; }

  constructor(node)
  {
    super();
  }
}
