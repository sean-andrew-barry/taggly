import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyDivide extends KeyDown
{
	static GetKeyName(){ return "divide"; }
	static GetKeyCode(){ return 111; }
	static GetMetaURL(){ return import.meta.url; }
}