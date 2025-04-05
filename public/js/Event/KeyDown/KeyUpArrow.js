import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyUpArrow extends KeyDown
{
	static GetKeyName(){ return "uparrow"; }
	static GetKeyCode(){ return 38; }
	static GetMetaURL(){ return import.meta.url; }
}