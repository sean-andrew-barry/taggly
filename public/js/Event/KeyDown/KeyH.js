import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyH extends KeyDown
{
	static GetKeyName(){ return "h"; }
	static GetKeyCode(){ return 72; }
	static GetMetaURL(){ return import.meta.url; }
}