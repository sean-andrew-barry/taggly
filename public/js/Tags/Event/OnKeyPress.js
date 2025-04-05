import {Event} from "/js/Tags/Event.js";

export class OnKeyPress extends Event
{
  static GetLocalName(){ return "keypress"; }
}

import {Environment} from "/js/Environment.js";
Environment.DepreciateFile(import.meta.url, "/js/Event.js");
