import {KeyDown} from "/js/Event/KeyDown.js";

export class Key9 extends KeyDown
{
	static GetKeyName(){ return "9"; }
	static GetKeyCode(){ return 57; }
	static GetMetaURL(){ return import.meta.url; }
}