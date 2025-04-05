import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF2 extends KeyDown
{
	static GetKeyName(){ return "f2"; }
	static GetKeyCode(){ return 113; }
	static GetMetaURL(){ return import.meta.url; }
}