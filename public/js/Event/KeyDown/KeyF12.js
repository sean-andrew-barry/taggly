import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF12 extends KeyDown
{
	static GetKeyName(){ return "f12"; }
	static GetKeyCode(){ return 123; }
	static GetMetaURL(){ return import.meta.url; }
}