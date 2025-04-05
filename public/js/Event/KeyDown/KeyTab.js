import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyTab extends KeyDown
{
	static GetKeyName(){ return "tab"; }
	static GetKeyCode(){ return 9; }
	static GetMetaURL(){ return import.meta.url; }
}