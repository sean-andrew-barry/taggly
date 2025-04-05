import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad8 extends KeyDown
{
	static GetKeyName(){ return "numpad8"; }
	static GetKeyCode(){ return 104; }
	static GetMetaURL(){ return import.meta.url; }
}