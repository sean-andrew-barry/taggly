import {KeyDown} from "/js/Event/KeyDown.js";

export class Key8 extends KeyDown
{
	static GetKeyName(){ return "8"; }
	static GetKeyCode(){ return 56; }
	static GetMetaURL(){ return import.meta.url; }
}