import {KeyDown} from "/js/Event/KeyDown.js";

export class Key3 extends KeyDown
{
	static GetKeyName(){ return "3"; }
	static GetKeyCode(){ return 51; }
	static GetMetaURL(){ return import.meta.url; }
}