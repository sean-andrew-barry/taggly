import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad3 extends KeyDown
{
	static GetKeyName(){ return "numpad3"; }
	static GetKeyCode(){ return 99; }
	static GetMetaURL(){ return import.meta.url; }
}