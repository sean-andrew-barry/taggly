import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyComma extends KeyDown
{
	static GetKeyName(){ return "comma"; }
	static GetKeyCode(){ return 188; }
	static GetMetaURL(){ return import.meta.url; }
}