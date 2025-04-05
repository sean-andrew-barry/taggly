import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyQ extends KeyDown
{
	static GetKeyName(){ return "q"; }
	static GetKeyCode(){ return 81; }
	static GetMetaURL(){ return import.meta.url; }
}