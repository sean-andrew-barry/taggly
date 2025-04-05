import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyA extends KeyDown
{
	static GetKeyName(){ return "a"; }
	static GetKeyCode(){ return 65; }
	static GetMetaURL(){ return import.meta.url; }
}