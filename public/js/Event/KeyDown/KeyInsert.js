import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyInsert extends KeyDown
{
	static GetKeyName(){ return "insert"; }
	static GetKeyCode(){ return 45; }
	static GetMetaURL(){ return import.meta.url; }
}