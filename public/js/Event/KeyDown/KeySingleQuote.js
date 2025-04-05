import {KeyDown} from "/js/Event/KeyDown.js";

export class KeySingleQuote extends KeyDown
{
	static GetKeyName(){ return "singlequote"; }
	static GetKeyCode(){ return 222; }
	static GetMetaURL(){ return import.meta.url; }
}