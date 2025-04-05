import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumLock extends KeyDown
{
	static GetKeyName(){ return "numlock"; }
	static GetKeyCode(){ return 144; }
	static GetMetaURL(){ return import.meta.url; }
}