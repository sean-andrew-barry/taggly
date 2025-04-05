import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyZ extends KeyDown
{
	static GetKeyName(){ return "z"; }
	static GetKeyCode(){ return 90; }
	static GetMetaURL(){ return import.meta.url; }
}