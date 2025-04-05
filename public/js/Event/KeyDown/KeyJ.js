import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyJ extends KeyDown
{
	static GetKeyName(){ return "j"; }
	static GetKeyCode(){ return 74; }
	static GetMetaURL(){ return import.meta.url; }
}