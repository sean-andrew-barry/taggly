import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF1 extends KeyDown
{
	static GetKeyName(){ return "f1"; }
	static GetKeyCode(){ return 112; }
	static GetMetaURL(){ return import.meta.url; }
}