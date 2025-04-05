import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyRightArrow extends KeyDown
{
	static GetKeyName(){ return "rightarrow"; }
	static GetKeyCode(){ return 39; }
	static GetMetaURL(){ return import.meta.url; }
}