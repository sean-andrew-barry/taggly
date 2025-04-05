import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyC extends KeyDown
{
	static GetKeyName(){ return "c"; }
	static GetKeyCode(){ return 67; }
	static GetMetaURL(){ return import.meta.url; }
}