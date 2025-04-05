import {KeyDown} from "/js/Event/KeyDown.js";

export class Key1 extends KeyDown
{
	static GetKeyName(){ return "1"; }
	static GetKeyCode(){ return 49; }
	static GetMetaURL(){ return import.meta.url; }
}