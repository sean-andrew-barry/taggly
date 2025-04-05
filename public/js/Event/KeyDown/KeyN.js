import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyN extends KeyDown
{
	static GetKeyName(){ return "n"; }
	static GetKeyCode(){ return 78; }
	static GetMetaURL(){ return import.meta.url; }
}