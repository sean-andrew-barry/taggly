import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyScrollLock extends KeyDown
{
	static GetKeyName(){ return "scrolllock"; }
	static GetKeyCode(){ return 145; }
	static GetMetaURL(){ return import.meta.url; }
}