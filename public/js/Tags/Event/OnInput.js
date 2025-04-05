import {Event} from "/js/Tags/Event.js";

export class OnInput extends Event
{
  static GetLocalName(){ return "input"; }

  GetData(){ return this.GetEvent()?.data; }
}
