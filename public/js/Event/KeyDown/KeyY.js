import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyY extends KeyDown
{
	static GetKeyName(){ return "y"; }
	static GetKeyCode(){ return 89; }
	static GetMetaURL(){ return import.meta.url; }
}