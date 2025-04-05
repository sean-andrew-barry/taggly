import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad7 extends KeyDown
{
	static GetKeyName(){ return "numpad7"; }
	static GetKeyCode(){ return 103; }
	static GetMetaURL(){ return import.meta.url; }
}