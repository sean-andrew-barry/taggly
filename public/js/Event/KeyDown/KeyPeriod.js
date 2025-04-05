import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyPeriod extends KeyDown
{
	static GetKeyName(){ return "period"; }
	static GetKeyCode(){ return 190; }
	static GetMetaURL(){ return import.meta.url; }
}