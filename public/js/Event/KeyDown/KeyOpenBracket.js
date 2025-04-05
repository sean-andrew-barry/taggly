import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyOpenBracket extends KeyDown
{
	static GetKeyName(){ return "openbracket"; }
	static GetKeyCode(){ return 219; }
	static GetMetaURL(){ return import.meta.url; }
}