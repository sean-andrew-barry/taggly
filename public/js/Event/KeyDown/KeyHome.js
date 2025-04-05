import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyHome extends KeyDown
{
	static GetKeyName(){ return "home"; }
	static GetKeyCode(){ return 36; }
	static GetMetaURL(){ return import.meta.url; }
}