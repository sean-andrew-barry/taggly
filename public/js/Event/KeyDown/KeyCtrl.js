import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyCtrl extends KeyDown
{
	static GetKeyName(){ return "ctrl"; }
	static GetKeyCode(){ return 17; }
	static GetMetaURL(){ return import.meta.url; }
}