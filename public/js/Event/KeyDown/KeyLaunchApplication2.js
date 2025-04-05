import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyLaunchApplication2 extends KeyDown
{
	static GetKeyName(){ return "launchapplication2"; }
	static GetKeyCode(){ return 183; }
	static GetMetaURL(){ return import.meta.url; }
}