import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyO extends KeyDown
{
	static GetKeyName(){ return "o"; }
	static GetKeyCode(){ return 79; }
	static GetMetaURL(){ return import.meta.url; }
}