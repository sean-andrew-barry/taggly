import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyCloseBraket extends KeyDown
{
	static GetKeyName(){ return "closebraket"; }
	static GetKeyCode(){ return 221; }
	static GetMetaURL(){ return import.meta.url; }
}