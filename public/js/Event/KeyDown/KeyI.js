import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyI extends KeyDown
{
	static GetKeyName(){ return "i"; }
	static GetKeyCode(){ return 73; }
	static GetMetaURL(){ return import.meta.url; }
}