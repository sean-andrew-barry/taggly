import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyP extends KeyDown
{
	static GetKeyName(){ return "p"; }
	static GetKeyCode(){ return 80; }
	static GetMetaURL(){ return import.meta.url; }
}