import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyShift extends KeyDown
{
	static GetKeyName(){ return "shift"; }
	static GetKeyCode(){ return 16; }
	static GetMetaURL(){ return import.meta.url; }
}