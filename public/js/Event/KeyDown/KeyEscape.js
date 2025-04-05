import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyEscape extends KeyDown
{
	static GetKeyName(){ return "escape"; }
	static GetKeyCode(){ return 27; }
	static GetMetaURL(){ return import.meta.url; }
}