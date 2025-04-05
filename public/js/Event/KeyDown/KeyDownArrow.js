import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyDownArrow extends KeyDown
{
	static GetKeyName(){ return "downarrow"; }
	static GetKeyCode(){ return 40; }
	static GetMetaURL(){ return import.meta.url; }
}