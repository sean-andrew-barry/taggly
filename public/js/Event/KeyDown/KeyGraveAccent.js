import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyGraveAccent extends KeyDown
{
	static GetKeyName(){ return "graveaccent"; }
	static GetKeyCode(){ return 192; }
	static GetMetaURL(){ return import.meta.url; }
}