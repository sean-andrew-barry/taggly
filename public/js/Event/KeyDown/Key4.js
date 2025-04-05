import {KeyDown} from "/js/Event/KeyDown.js";

export class Key4 extends KeyDown
{
	static GetKeyName(){ return "4"; }
	static GetKeyCode(){ return 52; }
	static GetMetaURL(){ return import.meta.url; }
}