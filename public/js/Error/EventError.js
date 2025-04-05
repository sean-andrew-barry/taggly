import {Error} from "/js/Error.js";

export class EventError extends Error
{
  constructor()
  {
    super();
  }

  get message(){ return ``; }
}
