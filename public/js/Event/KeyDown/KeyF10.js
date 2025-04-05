import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyF10 extends KeyDown
{
	static GetKeyName(){ return "f10"; }
	static GetKeyCode(){ return 121; }
	static GetMetaURL(){ return import.meta.url; }
}