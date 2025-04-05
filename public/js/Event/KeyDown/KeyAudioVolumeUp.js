import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyAudioVolumeUp extends KeyDown
{
	static GetKeyName(){ return "audiovolumeup"; }
	static GetKeyCode(){ return 175; }
	static GetMetaURL(){ return import.meta.url; }
}