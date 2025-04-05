import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF5 extends KeyDown
{
	static GetKeyName(){ return "f5"; }
	static GetKeyCode(){ return 116; }
	static GetMetaURL(){ return import.meta.url; }
}