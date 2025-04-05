import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyEnd extends KeyDown
{
	static GetKeyName(){ return "end"; }
	static GetKeyCode(){ return 35; }
	static GetMetaURL(){ return import.meta.url; }
}