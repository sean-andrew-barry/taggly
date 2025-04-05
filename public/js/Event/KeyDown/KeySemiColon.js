import {KeyDown} from "/js/Event/KeyDown.js";

export class KeySemiColon extends KeyDown
{
	static GetKeyName(){ return "semicolon"; }
	static GetKeyCode(){ return 186; }
	static GetMetaURL(){ return import.meta.url; }
}