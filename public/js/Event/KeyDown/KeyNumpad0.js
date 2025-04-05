import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad0 extends KeyDown
{
	static GetKeyName(){ return "numpad0"; }
	static GetKeyCode(){ return 96; }
	static GetMetaURL(){ return import.meta.url; }
}