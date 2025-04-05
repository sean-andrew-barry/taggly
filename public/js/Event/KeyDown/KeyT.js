import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyT extends KeyDown
{
	static GetKeyName(){ return "t"; }
	static GetKeyCode(){ return 84; }
	static GetMetaURL(){ return import.meta.url; }
}