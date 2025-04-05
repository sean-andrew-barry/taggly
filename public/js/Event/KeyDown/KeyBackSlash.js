import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyBackSlash extends KeyDown
{
	static GetKeyName(){ return "backslash"; }
	static GetKeyCode(){ return 220; }
	static GetMetaURL(){ return import.meta.url; }
}