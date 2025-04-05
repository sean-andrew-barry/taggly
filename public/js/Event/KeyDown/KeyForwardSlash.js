import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyForwardSlash extends KeyDown
{
	static GetKeyName(){ return "forwardslash"; }
	static GetKeyCode(){ return 191; }
	static GetMetaURL(){ return import.meta.url; }
}