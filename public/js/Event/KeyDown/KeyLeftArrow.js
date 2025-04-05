import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyLeftArrow extends KeyDown
{
	static GetKeyName(){ return "leftarrow"; }
	static GetKeyCode(){ return 37; }
	static GetMetaURL(){ return import.meta.url; }
}