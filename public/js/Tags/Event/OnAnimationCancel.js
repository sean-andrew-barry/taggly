import {Event} from "/js/Tags/Event.js";

export class OnAnimationCancel extends Event
{
  static GetLocalName(){ return "on-animation-cancel"; }
}

import {Environment} from "/js/Environment.js";
Environment.DepreciateFile(import.meta.url, "/js/Event/OnAnimationCancel.js");
