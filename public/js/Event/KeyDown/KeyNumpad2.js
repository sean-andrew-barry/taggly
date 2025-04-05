import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad2 extends KeyDown
{
	static GetKeyName(){ return "numpad2"; }
	static GetKeyCode(){ return 98; }
	static GetMetaURL(){ return import.meta.url; }
}