import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad4 extends KeyDown
{
	static GetKeyName(){ return "numpad4"; }
	static GetKeyCode(){ return 100; }
	static GetMetaURL(){ return import.meta.url; }
}