import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyG extends KeyDown
{
	static GetKeyName(){ return "g"; }
	static GetKeyCode(){ return 71; }
	static GetMetaURL(){ return import.meta.url; }
}