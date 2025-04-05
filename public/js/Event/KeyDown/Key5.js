import {KeyDown} from "/js/Event/KeyDown.js";

export class Key5 extends KeyDown
{
	static GetKeyName(){ return "5"; }
	static GetKeyCode(){ return 53; }
	static GetMetaURL(){ return import.meta.url; }
}