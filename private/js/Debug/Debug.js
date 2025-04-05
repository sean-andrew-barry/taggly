import {Debug as Base} from "/js/Debug/Debug.js?after=/taggly/private/";

export class Debug extends Base
{
  static IsServer(){ return true; }
  static IsClient(){ return false; }
  static IsInlineFrame(v){ return false; }
}