import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyDash extends KeyDown
{
	static GetKeyName(){ return "dash"; }
	static GetKeyCode(){ return 189; }
	static GetMetaURL(){ return import.meta.url; }
}