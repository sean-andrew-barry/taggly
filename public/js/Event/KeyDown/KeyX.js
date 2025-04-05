import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyX extends KeyDown
{
	static GetKeyName(){ return "x"; }
	static GetKeyCode(){ return 88; }
	static GetMetaURL(){ return import.meta.url; }
}