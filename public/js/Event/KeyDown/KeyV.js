import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyV extends KeyDown
{
	static GetKeyName(){ return "v"; }
	static GetKeyCode(){ return 86; }
	static GetMetaURL(){ return import.meta.url; }
}