import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyAdd extends KeyDown
{
	static GetKeyName(){ return "add"; }
	static GetKeyCode(){ return 107; }
	static GetMetaURL(){ return import.meta.url; }
}