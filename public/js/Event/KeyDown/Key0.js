import {KeyDown} from "/js/Event/KeyDown.js";

export class Key0 extends KeyDown
{
	static GetKeyName(){ return "0"; }
	static GetKeyCode(){ return 48; }
	static GetMetaURL(){ return import.meta.url; }
}
