import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF7 extends KeyDown
{
	static GetKeyName(){ return "f7"; }
	static GetKeyCode(){ return 118; }
	static GetMetaURL(){ return import.meta.url; }
}