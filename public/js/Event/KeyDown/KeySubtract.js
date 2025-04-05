import {KeyDown} from "/js/Event/KeyDown.js";

export class KeySubtract extends KeyDown
{
	static GetKeyName(){ return "subtract"; }
	static GetKeyCode(){ return 109; }
	static GetMetaURL(){ return import.meta.url; }
}