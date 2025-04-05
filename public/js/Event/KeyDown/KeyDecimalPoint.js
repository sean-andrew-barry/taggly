import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyDecimalPoint extends KeyDown
{
	static GetKeyName(){ return "decimalpoint"; }
	static GetKeyCode(){ return 110; }
	static GetMetaURL(){ return import.meta.url; }
}