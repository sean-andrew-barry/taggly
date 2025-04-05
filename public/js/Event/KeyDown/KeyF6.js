import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF6 extends KeyDown
{
	static GetKeyName(){ return "f6"; }
	static GetKeyCode(){ return 117; }
	static GetMetaURL(){ return import.meta.url; }
}