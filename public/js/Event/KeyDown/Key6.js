import {KeyDown} from "/js/Event/KeyDown.js";

export class Key6 extends KeyDown
{
	static GetKeyName(){ return "6"; }
	static GetKeyCode(){ return 54; }
	static GetMetaURL(){ return import.meta.url; }
}