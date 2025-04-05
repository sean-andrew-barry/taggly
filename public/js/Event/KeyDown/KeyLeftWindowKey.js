import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyLeftWindowKey extends KeyDown
{
	static GetKeyName(){ return "leftwindowkey"; }
	static GetKeyCode(){ return 91; }
	static GetMetaURL(){ return import.meta.url; }
}