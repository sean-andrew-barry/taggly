import {KeyDown} from "/js/Event/KeyDown.js";

export class KeyLaunchMediaPlayer extends KeyDown
{
	static GetKeyName(){ return "launchmediaplayer"; }
	static GetKeyCode(){ return 181; }
	static GetMetaURL(){ return import.meta.url; }
}