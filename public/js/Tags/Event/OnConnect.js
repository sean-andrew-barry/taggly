import {Event} from "/js/Tags/Event.js";
import {Environment} from "/js/Environment.js";

// Environment.DepreciateFile(import.meta.url, "/js/Event/Connect.js");

export class OnConnect extends Event
{
  static GetLocalName(){ return "on-connect"; }
}

Environment.DepreciateFile(import.meta.url, "/js/Event/Connect.js");
