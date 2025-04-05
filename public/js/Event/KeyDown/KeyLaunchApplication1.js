import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyLaunchApplication1 extends KeyDown
{
	static GetKeyName(){ return "launchapplication1"; }
	static GetKeyCode(){ return 182; }
	static GetMetaURL(){ return import.meta.url; }
}