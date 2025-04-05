import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyAlt extends KeyDown
{
	static GetKeyName(){ return "alt"; }
	static GetKeyCode(){ return 18; }
	static GetMetaURL(){ return import.meta.url; }
}