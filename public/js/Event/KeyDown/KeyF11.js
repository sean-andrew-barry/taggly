import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF11 extends KeyDown
{
	static GetKeyName(){ return "f11"; }
	static GetKeyCode(){ return 122; }
	static GetMetaURL(){ return import.meta.url; }
}