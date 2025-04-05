import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyW extends KeyDown
{
	static GetKeyName(){ return "w"; }
	static GetKeyCode(){ return 87; }
	static GetMetaURL(){ return import.meta.url; }
}