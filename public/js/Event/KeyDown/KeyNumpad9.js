import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad9 extends KeyDown
{
	static GetKeyName(){ return "numpad9"; }
	static GetKeyCode(){ return 105; }
	static GetMetaURL(){ return import.meta.url; }
}