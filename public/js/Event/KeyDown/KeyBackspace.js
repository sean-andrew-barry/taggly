import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyBackspace extends KeyDown
{
	static GetKeyName(){ return "backspace"; }
	static GetKeyCode(){ return 8; }
	static GetMetaURL(){ return import.meta.url; }
}