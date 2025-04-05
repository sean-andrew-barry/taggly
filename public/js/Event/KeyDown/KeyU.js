import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyU extends KeyDown
{
	static GetKeyName(){ return "u"; }
	static GetKeyCode(){ return 85; }
	static GetMetaURL(){ return import.meta.url; }
}