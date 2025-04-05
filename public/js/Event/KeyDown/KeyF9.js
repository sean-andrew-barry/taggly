import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF9 extends KeyDown
{
	static GetKeyName(){ return "f9"; }
	static GetKeyCode(){ return 120; }
	static GetMetaURL(){ return import.meta.url; }
}