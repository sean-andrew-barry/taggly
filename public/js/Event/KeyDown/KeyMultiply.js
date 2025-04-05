import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyMultiply extends KeyDown
{
	static GetKeyName(){ return "multiply"; }
	static GetKeyCode(){ return 106; }
	static GetMetaURL(){ return import.meta.url; }
}