import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyL extends KeyDown
{
	static GetKeyName(){ return "l"; }
	static GetKeyCode(){ return 76; }
	static GetMetaURL(){ return import.meta.url; }
}