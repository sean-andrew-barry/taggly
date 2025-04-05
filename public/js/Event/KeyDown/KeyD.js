import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyD extends KeyDown
{
	static GetKeyName(){ return "d"; }
	static GetKeyCode(){ return 68; }
	static GetMetaURL(){ return import.meta.url; }
}