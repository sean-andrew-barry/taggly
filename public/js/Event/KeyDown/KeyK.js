import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyK extends KeyDown
{
	static GetKeyName(){ return "k"; }
	static GetKeyCode(){ return 75; }
	static GetMetaURL(){ return import.meta.url; }
}