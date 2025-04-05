import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyCapsLock extends KeyDown
{
	static GetKeyName(){ return "capslock"; }
	static GetKeyCode(){ return 20; }
	static GetMetaURL(){ return import.meta.url; }
}