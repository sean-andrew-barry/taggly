import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyAudioVolumeDown extends KeyDown
{
	static GetKeyName(){ return "audiovolumedown"; }
	static GetKeyCode(){ return 174; }
	static GetMetaURL(){ return import.meta.url; }
}