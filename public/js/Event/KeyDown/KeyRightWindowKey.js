import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyRightWindowKey extends KeyDown
{
	static GetKeyName(){ return "rightwindowkey"; }
	static GetKeyCode(){ return 92; }
	static GetMetaURL(){ return import.meta.url; }
}