import {KeyDown} from "/js/Event/KeyDown.js";

export class Key7 extends KeyDown
{
	static GetKeyName(){ return "7"; }
	static GetKeyCode(){ return 55; }
	static GetMetaURL(){ return import.meta.url; }
}