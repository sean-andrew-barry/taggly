import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyAudioVolumeMute extends KeyDown
{
	static GetKeyName(){ return "audiovolumemute"; }
	static GetKeyCode(){ return 173; }
	static GetMetaURL(){ return import.meta.url; }
}