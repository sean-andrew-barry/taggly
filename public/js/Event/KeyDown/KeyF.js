import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF extends KeyDown
{
	static GetKeyName(){ return "f"; }
	static GetKeyCode(){ return 70; }
	static GetMetaURL(){ return import.meta.url; }
}