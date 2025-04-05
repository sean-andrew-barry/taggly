import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyE extends KeyDown
{
	static GetKeyName(){ return "e"; }
	static GetKeyCode(){ return 69; }
	static GetMetaURL(){ return import.meta.url; }
}