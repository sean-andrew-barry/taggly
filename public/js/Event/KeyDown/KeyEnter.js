import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyEnter extends KeyDown
{
	static GetKeyName(){ return "enter"; }
	static GetKeyCode(){ return 13; }
	static GetMetaURL(){ return import.meta.url; }
}