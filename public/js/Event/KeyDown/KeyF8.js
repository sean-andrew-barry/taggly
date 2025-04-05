import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF8 extends KeyDown
{
	static GetKeyName(){ return "f8"; }
	static GetKeyCode(){ return 119; }
	static GetMetaURL(){ return import.meta.url; }
}