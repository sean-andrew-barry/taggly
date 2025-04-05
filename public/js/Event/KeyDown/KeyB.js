import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyB extends KeyDown
{
	static GetKeyName(){ return "b"; }
	static GetKeyCode(){ return 66; }
	static GetMetaURL(){ return import.meta.url; }
}