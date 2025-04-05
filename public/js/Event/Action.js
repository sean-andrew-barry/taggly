import {Event} from "/js/Event.js";

export class Action extends Event
{
  static GetLocalName(){ return "Action"; }
  static GetMetaURL(){ return import.meta.url; }

  constructor(tag, event, action)
  {
    super(tag, event, { action });

    console.log("Constructed Action event");
  }
}
