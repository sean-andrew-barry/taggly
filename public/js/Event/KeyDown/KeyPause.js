import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyPause extends KeyDown
{
	static GetKeyName(){ return "pause"; }
	static GetKeyCode(){ return 19; }
	static GetMetaURL(){ return import.meta.url; }
}