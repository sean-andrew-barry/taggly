import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyDelete extends KeyDown
{
	static GetKeyName(){ return "delete"; }
	static GetKeyCode(){ return 46; }
	static GetMetaURL(){ return import.meta.url; }
}