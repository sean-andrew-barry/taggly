import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyR extends KeyDown
{
	static GetKeyName(){ return "r"; }
	static GetKeyCode(){ return 82; }
	static GetMetaURL(){ return import.meta.url; }
}