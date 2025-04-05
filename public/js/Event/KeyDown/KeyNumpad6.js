import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad6 extends KeyDown
{
	static GetKeyName(){ return "numpad6"; }
	static GetKeyCode(){ return 102; }
	static GetMetaURL(){ return import.meta.url; }
}