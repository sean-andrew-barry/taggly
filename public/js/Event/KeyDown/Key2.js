import {KeyDown} from "/js/Event/KeyDown.js";

export class Key2 extends KeyDown
{
	static GetKeyName(){ return "2"; }
	static GetKeyCode(){ return 50; }
	static GetMetaURL(){ return import.meta.url; }
}