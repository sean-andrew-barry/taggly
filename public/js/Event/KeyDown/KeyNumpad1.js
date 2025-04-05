import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyNumpad1 extends KeyDown
{
	static GetKeyName(){ return "numpad1"; }
	static GetKeyCode(){ return 97; }
	static GetMetaURL(){ return import.meta.url; }
}