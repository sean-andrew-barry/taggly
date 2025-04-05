import {Event} from "/js/Event.js";

export class KeyDown extends Event
{
  static OnCapture(node, event)
  {
    const key_code = this.GetKeyCode();

    // If the KeyDown has a key_code, filter out all keydown events that don't match
    if (key_code !== undefined && event.keyCode === key_code)
    {
      return super.OnCapture(node, event);
    }
  }

  static GetKeyCode(){}
	static GetLocalName(){ return "keydown"; }
	static GetMetaURL(){ return import.meta.url; }
}

export class KeyBackspace extends KeyDown
{
  static GetKeyName(){ return "backspace"; }
  static GetKeyCode(){ return 8; }
}

export class KeyTab extends KeyDown
{
  static GetKeyName(){ return "tab"; }
  static GetKeyCode(){ return 9; }
}

export class KeyEnter extends KeyDown
{
  static GetKeyName(){ return "enter"; }
  static GetKeyCode(){ return 13; }
}

export class KeyCtrl extends KeyDown
{
  static GetKeyName(){ return "ctrl"; }
  static GetKeyCode(){ return 17; }
}

export class KeyShift extends KeyDown
{
  static GetKeyName(){ return "shift"; }
  static GetKeyCode(){ return 16; }
}

export class KeyAlt extends KeyDown
{
  static GetKeyName(){ return "alt"; }
  static GetKeyCode(){ return 18; }
}

export class KeyPause extends KeyDown
{
  static GetKeyName(){ return "pause"; }
  static GetKeyCode(){ return 19; }
}

export class KeyCapsLock extends KeyDown
{
  static GetKeyName(){ return "capslock"; }
  static GetKeyCode(){ return 20; }
}

export class KeyEscape extends KeyDown
{
  static GetKeyName(){ return "escape"; }
  static GetKeyCode(){ return 27; }
}

export class KeyPageUp extends KeyDown
{
  static GetKeyName(){ return "pageup"; }
  static GetKeyCode(){ return 33; }
}

export class KeyPageDown extends KeyDown
{
  static GetKeyName(){ return "pagedown"; }
  static GetKeyCode(){ return 34; }
}

export class KeyEnd extends KeyDown
{
  static GetKeyName(){ return "end"; }
  static GetKeyCode(){ return 35; }
}

export class KeyHome extends KeyDown
{
  static GetKeyName(){ return "home"; }
  static GetKeyCode(){ return 36; }
}

export class KeyLeftArrow extends KeyDown
{
  static GetKeyName(){ return "leftarrow"; }
  static GetKeyCode(){ return 37; }
}

export class KeyUpArrow extends KeyDown
{
  static GetKeyName(){ return "uparrow"; }
  static GetKeyCode(){ return 38; }
}

export class KeyRightArrow extends KeyDown
{
  static GetKeyName(){ return "rightarrow"; }
  static GetKeyCode(){ return 39; }
}

export class KeyDownArrow extends KeyDown
{
  static GetKeyName(){ return "downarrow"; }
  static GetKeyCode(){ return 40; }
}

export class KeyInsert extends KeyDown
{
  static GetKeyName(){ return "insert"; }
  static GetKeyCode(){ return 45; }
}

export class KeyDelete extends KeyDown
{
  static GetKeyName(){ return "delete"; }
  static GetKeyCode(){ return 46; }
}

export class Key0 extends KeyDown
{
  static GetKeyName(){ return "0"; }
  static GetKeyCode(){ return 48; }
}


export class Key1 extends KeyDown
{
  static GetKeyName(){ return "1"; }
  static GetKeyCode(){ return 49; }
}

export class Key2 extends KeyDown
{
  static GetKeyName(){ return "2"; }
  static GetKeyCode(){ return 50; }
}

export class Key3 extends KeyDown
{
  static GetKeyName(){ return "3"; }
  static GetKeyCode(){ return 51; }
}

export class Key4 extends KeyDown
{
  static GetKeyName(){ return "4"; }
  static GetKeyCode(){ return 52; }
}

export class Key5 extends KeyDown
{
  static GetKeyName(){ return "5"; }
  static GetKeyCode(){ return 53; }
}

export class Key6 extends KeyDown
{
  static GetKeyName(){ return "6"; }
  static GetKeyCode(){ return 54; }
}

export class Key7 extends KeyDown
{
  static GetKeyName(){ return "7"; }
  static GetKeyCode(){ return 55; }
}

export class Key8 extends KeyDown
{
  static GetKeyName(){ return "8"; }
  static GetKeyCode(){ return 56; }
}

export class Key9 extends KeyDown
{
  static GetKeyName(){ return "9"; }
  static GetKeyCode(){ return 57; }
}

export class KeyA extends KeyDown
{
  static GetKeyName(){ return "a"; }
  static GetKeyCode(){ return 65; }
}

export class KeyB extends KeyDown
{
  static GetKeyName(){ return "b"; }
  static GetKeyCode(){ return 66; }
}

export class KeyC extends KeyDown
{
  static GetKeyName(){ return "c"; }
  static GetKeyCode(){ return 67; }
}

export class KeyD extends KeyDown
{
  static GetKeyName(){ return "d"; }
  static GetKeyCode(){ return 68; }
}

export class KeyE extends KeyDown
{
  static GetKeyName(){ return "e"; }
  static GetKeyCode(){ return 69; }
}

export class KeyF extends KeyDown
{
  static GetKeyName(){ return "f"; }
  static GetKeyCode(){ return 70; }
}

export class KeyG extends KeyDown
{
  static GetKeyName(){ return "g"; }
  static GetKeyCode(){ return 71; }
}

export class KeyH extends KeyDown
{
  static GetKeyName(){ return "h"; }
  static GetKeyCode(){ return 72; }
}

export class KeyI extends KeyDown
{
  static GetKeyName(){ return "i"; }
  static GetKeyCode(){ return 73; }
}

export class KeyJ extends KeyDown
{
  static GetKeyName(){ return "j"; }
  static GetKeyCode(){ return 74; }
}

export class KeyK extends KeyDown
{
  static GetKeyName(){ return "k"; }
  static GetKeyCode(){ return 75; }
}

export class KeyL extends KeyDown
{
  static GetKeyName(){ return "l"; }
  static GetKeyCode(){ return 76; }
}

export class KeyM extends KeyDown
{
  static GetKeyName(){ return "m"; }
  static GetKeyCode(){ return 77; }
}

export class KeyN extends KeyDown
{
  static GetKeyName(){ return "n"; }
  static GetKeyCode(){ return 78; }
}

export class KeyO extends KeyDown
{
  static GetKeyName(){ return "o"; }
  static GetKeyCode(){ return 79; }
}

export class KeyP extends KeyDown
{
  static GetKeyName(){ return "p"; }
  static GetKeyCode(){ return 80; }
}

export class KeyQ extends KeyDown
{
  static GetKeyName(){ return "q"; }
  static GetKeyCode(){ return 81; }
}

export class KeyR extends KeyDown
{
  static GetKeyName(){ return "r"; }
  static GetKeyCode(){ return 82; }
}

export class KeyS extends KeyDown
{
  static GetKeyName(){ return "s"; }
  static GetKeyCode(){ return 83; }
}

export class KeyT extends KeyDown
{
  static GetKeyName(){ return "t"; }
  static GetKeyCode(){ return 84; }
}

export class KeyU extends KeyDown
{
  static GetKeyName(){ return "u"; }
  static GetKeyCode(){ return 85; }
}

export class KeyV extends KeyDown
{
  static GetKeyName(){ return "v"; }
  static GetKeyCode(){ return 86; }
}

export class KeyW extends KeyDown
{
  static GetKeyName(){ return "w"; }
  static GetKeyCode(){ return 87; }
}

export class KeyX extends KeyDown
{
  static GetKeyName(){ return "x"; }
  static GetKeyCode(){ return 88; }
}

export class KeyY extends KeyDown
{
  static GetKeyName(){ return "y"; }
  static GetKeyCode(){ return 89; }
}

export class KeyZ extends KeyDown
{
  static GetKeyName(){ return "z"; }
  static GetKeyCode(){ return 90; }
}

export class KeyLeftWindowKey extends KeyDown
{
  static GetKeyName(){ return "leftwindowkey"; }
  static GetKeyCode(){ return 91; }
}

export class KeyRightWindowKey extends KeyDown
{
  static GetKeyName(){ return "rightwindowkey"; }
  static GetKeyCode(){ return 92; }
}

export class KeySelectKey extends KeyDown
{
  static GetKeyName(){ return "selectkey"; }
  static GetKeyCode(){ return 93; }
}

export class KeyNumpad0 extends KeyDown
{
  static GetKeyName(){ return "numpad0"; }
  static GetKeyCode(){ return 96; }
}

export class KeyNumpad1 extends KeyDown
{
  static GetKeyName(){ return "numpad1"; }
  static GetKeyCode(){ return 97; }
}

export class KeyNumpad2 extends KeyDown
{
  static GetKeyName(){ return "numpad2"; }
  static GetKeyCode(){ return 98; }
}

export class KeyNumpad3 extends KeyDown
{
  static GetKeyName(){ return "numpad3"; }
  static GetKeyCode(){ return 99; }
}

export class KeyNumpad4 extends KeyDown
{
  static GetKeyName(){ return "numpad4"; }
  static GetKeyCode(){ return 100; }
}

export class KeyNumpad5 extends KeyDown
{
  static GetKeyName(){ return "numpad5"; }
  static GetKeyCode(){ return 101; }
}

export class KeyNumpad6 extends KeyDown
{
  static GetKeyName(){ return "numpad6"; }
  static GetKeyCode(){ return 102; }
}

export class KeyNumpad7 extends KeyDown
{
  static GetKeyName(){ return "numpad7"; }
  static GetKeyCode(){ return 103; }
}

export class KeyNumpad8 extends KeyDown
{
  static GetKeyName(){ return "numpad8"; }
  static GetKeyCode(){ return 104; }
}

export class KeyNumpad9 extends KeyDown
{
  static GetKeyName(){ return "numpad9"; }
  static GetKeyCode(){ return 105; }
}

export class KeyMultiply extends KeyDown
{
  static GetKeyName(){ return "multiply"; }
  static GetKeyCode(){ return 106; }
}

export class KeyAdd extends KeyDown
{
  static GetKeyName(){ return "add"; }
  static GetKeyCode(){ return 107; }
}

export class KeySubtract extends KeyDown
{
  static GetKeyName(){ return "subtract"; }
  static GetKeyCode(){ return 109; }
}

export class KeyDecimalPoint extends KeyDown
{
  static GetKeyName(){ return "decimalpoint"; }
  static GetKeyCode(){ return 110; }
}

export class KeyDivide extends KeyDown
{
  static GetKeyName(){ return "divide"; }
  static GetKeyCode(){ return 111; }
}

export class KeyF1 extends KeyDown
{
  static GetKeyName(){ return "f1"; }
  static GetKeyCode(){ return 112; }
}

export class KeyF2 extends KeyDown
{
  static GetKeyName(){ return "f2"; }
  static GetKeyCode(){ return 113; }
}

export class KeyF3 extends KeyDown
{
  static GetKeyName(){ return "f3"; }
  static GetKeyCode(){ return 114; }
}

export class KeyF4 extends KeyDown
{
  static GetKeyName(){ return "f4"; }
  static GetKeyCode(){ return 115; }
}

export class KeyF5 extends KeyDown
{
  static GetKeyName(){ return "f5"; }
  static GetKeyCode(){ return 116; }
}

export class KeyF6 extends KeyDown
{
  static GetKeyName(){ return "f6"; }
  static GetKeyCode(){ return 117; }
}

export class KeyF7 extends KeyDown
{
  static GetKeyName(){ return "f7"; }
  static GetKeyCode(){ return 118; }
}

export class KeyF8 extends KeyDown
{
  static GetKeyName(){ return "f8"; }
  static GetKeyCode(){ return 119; }
}

export class KeyF9 extends KeyDown
{
  static GetKeyName(){ return "f9"; }
  static GetKeyCode(){ return 120; }
}

export class KeyF10 extends KeyDown
{
  static GetKeyName(){ return "f10"; }
  static GetKeyCode(){ return 121; }
}

export class KeyF11 extends KeyDown
{
  static GetKeyName(){ return "f11"; }
  static GetKeyCode(){ return 122; }
}

export class KeyF12 extends KeyDown
{
  static GetKeyName(){ return "f12"; }
  static GetKeyCode(){ return 123; }
}

export class KeyNumLock extends KeyDown
{
  static GetKeyName(){ return "numlock"; }
  static GetKeyCode(){ return 144; }
}

export class KeyScrollLock extends KeyDown
{
  static GetKeyName(){ return "scrolllock"; }
  static GetKeyCode(){ return 145; }
}

export class KeyAudioVolumeMute extends KeyDown
{
  static GetKeyName(){ return "audiovolumemute"; }
  static GetKeyCode(){ return 173; }
}

export class KeyAudioVolumeDown extends KeyDown
{
  static GetKeyName(){ return "audiovolumedown"; }
  static GetKeyCode(){ return 174; }
}

export class KeyLaunchMediaPlayer extends KeyDown
{
  static GetKeyName(){ return "launchmediaplayer"; }
  static GetKeyCode(){ return 181; }
}

export class KeyAudioVolumeUp extends KeyDown
{
  static GetKeyName(){ return "audiovolumeup"; }
  static GetKeyCode(){ return 175; }
}

export class KeyLaunchApplication1 extends KeyDown
{
  static GetKeyName(){ return "launchapplication1"; }
  static GetKeyCode(){ return 182; }
}

export class KeyLaunchApplication2 extends KeyDown
{
  static GetKeyName(){ return "launchapplication2"; }
  static GetKeyCode(){ return 183; }
}

export class KeySemiColon extends KeyDown
{
  static GetKeyName(){ return "semicolon"; }
  static GetKeyCode(){ return 186; }
}

export class KeyEqualSign extends KeyDown
{
  static GetKeyName(){ return "equalsign"; }
  static GetKeyCode(){ return 187; }
}

export class KeyComma extends KeyDown
{
  static GetKeyName(){ return "comma"; }
  static GetKeyCode(){ return 188; }
}

export class KeyDash extends KeyDown
{
  static GetKeyName(){ return "dash"; }
  static GetKeyCode(){ return 189; }
}

export class KeyPeriod extends KeyDown
{
  static GetKeyName(){ return "period"; }
  static GetKeyCode(){ return 190; }
}

export class KeyForwardSlash extends KeyDown
{
  static GetKeyName(){ return "forwardslash"; }
  static GetKeyCode(){ return 191; }
}

export class KeyGraveAccent extends KeyDown
{
  static GetKeyName(){ return "graveaccent"; }
  static GetKeyCode(){ return 192; }
}

export class KeyOpenBracket extends KeyDown
{
  static GetKeyName(){ return "openbracket"; }
  static GetKeyCode(){ return 219; }
}

export class KeyBackSlash extends KeyDown
{
  static GetKeyName(){ return "backslash"; }
  static GetKeyCode(){ return 220; }
}

export class KeyCloseBraket extends KeyDown
{
  static GetKeyName(){ return "closebraket"; }
  static GetKeyCode(){ return 221; }
}

export class KeySingleQuote extends KeyDown
{
  static GetKeyName(){ return "singlequote"; }
  static GetKeyCode(){ return 222; }
}
