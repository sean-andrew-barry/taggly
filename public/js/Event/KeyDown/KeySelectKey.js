import {KeyDown} from "/js/Event/KeyDown.js";

export class KeySelectKey extends KeyDown
{
	static GetKeyName(){ return "selectkey"; }
	static GetKeyCode(){ return 93; }
	static GetMetaURL(){ return import.meta.url; }
}