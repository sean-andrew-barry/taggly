import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyEqualSign extends KeyDown
{
	static GetKeyName(){ return "equalsign"; }
	static GetKeyCode(){ return 187; }
	static GetMetaURL(){ return import.meta.url; }
}