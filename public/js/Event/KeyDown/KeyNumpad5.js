import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad5 extends KeyDown
{
	static GetKeyName(){ return "numpad5"; }
	static GetKeyCode(){ return 101; }
	static GetMetaURL(){ return import.meta.url; }
}