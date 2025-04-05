import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyS extends KeyDown
{
	static GetKeyName(){ return "s"; }
	static GetKeyCode(){ return 83; }
	static GetMetaURL(){ return import.meta.url; }
}