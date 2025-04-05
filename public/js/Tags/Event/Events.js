import {Tag} from "/js/Tag.js";
import {Event} from "/js/Tags/Event.js";

import {Environment} from "/js/Environment.js";
Environment.DepreciateFile(import.meta.url, "/js/Events.js");

export class OnMutation extends Event { static GetName(){ return "OnMutation"; } }
export class OnRender extends Event { static GetName(){ return "OnRender"; } }
export class OnReflow extends Event { static GetName(){ return "OnReflow"; } }
export class OnLog extends Event { static GetName(){ return "OnLog"; } }
export class OnWarn extends Event { static GetName(){ return "OnWarn"; } }
export class OnError extends Event { static GetName(){ return "OnError"; } }
export class OnDebug extends Event { static GetName(){ return "OnDebug"; } }
// export {OnReflow} from "/js/Tags/Event/OnReflow.js";
// export {OnLog} from "/js/Tags/Event/OnLog.js";
// export {OnWarn} from "/js/Tags/Event/OnWarn.js";
// export {OnError} from "/js/Tags/Event/OnError.js";
// export {OnDebug} from "/js/Tags/Event/OnDebug.js";

export {OnConnect} from "/js/Tags/Event/OnConnect.js";
export {OnDisconnect} from "/js/Tags/Event/OnDisconnect.js";
export {OnMobile} from "/js/Tags/Event/OnMobile.js";
export {OnTablet} from "/js/Tags/Event/OnTablet.js";
export {OnTouch} from "/js/Tags/Event/OnTouch.js";
export {OnDesktop} from "/js/Tags/Event/OnDesktop.js";
export {OnWidescreen} from "/js/Tags/Event/OnWidescreen.js";
export {OnFullHD} from "/js/Tags/Event/OnFullHD.js";
export {OnNotMobile} from "/js/Tags/Event/OnNotMobile.js";
export {OnNotTablet} from "/js/Tags/Event/OnNotTablet.js";
export {OnNotDesktop} from "/js/Tags/Event/OnNotDesktop.js";
export {OnNotWidescreen} from "/js/Tags/Event/OnNotWidescreen.js";
export {OnNotFullHD} from "/js/Tags/Event/OnNotFullHD.js";
export {OnFullViewEnter} from "/js/Tags/Event/OnFullViewEnter.js";
export {OnFullViewLeave} from "/js/Tags/Event/OnFullViewLeave.js";
export {OnViewEnter} from "/js/Tags/Event/OnViewEnter.js";
export {OnViewLeave} from "/js/Tags/Event/OnViewLeave.js";
export {OnAnimationPlay} from "/js/Tags/Event/OnAnimationPlay.js";
export {OnAnimationCancel} from "/js/Tags/Event/OnAnimationCancel.js";
export {OnAnimationFinish} from "/js/Tags/Event/OnAnimationFinish.js";
export {OnAnimationReverse} from "/js/Tags/Event/OnAnimationReverse.js";
export {OnAnimationPause} from "/js/Tags/Event/OnAnimationPause.js";
export {OnAnimationStart} from "/js/Tags/Event/OnAnimationStart.js";
export {OnAnimationEnd} from "/js/Tags/Event/OnAnimationEnd.js";
export {OnAnimationIteration} from "/js/Tags/Event/OnAnimationIteration.js";

export class OnScroll extends Event { static GetName(){ return "scroll"; } }
export class OnLoad extends Event { static GetName(){ return "load"; } }
// export class OnInput extends Event { static GetName(){ return "input"; } }
export {OnInput} from "/js/Tags/Event/OnInput.js";
export class OnFocus extends Event { static GetName(){ return "focus"; } }
export class OnBlur extends Event { static GetName(){ return "blur"; } }
export class OnChange extends Event { static GetName(){ return "change"; } }
export class OnSubmit extends Event { static GetName(){ return "submit"; } }
export class OnClick extends Event { static GetName(){ return "click"; } }
export class OnContextMenu extends Event { static GetName(){ return "contextmenu"; } }
export class OnDoubleClick extends Event { static GetName(){ return "dblclick"; } }
export class OnMouseDown extends Event { static GetName(){ return "mousedown"; } }
export class OnMouseUp extends Event { static GetName(){ return "mouseup"; } }
// export class OnMouseOver extends Event { static GetName(){ return "mouseover"; } }
export {OnMouseOver} from "/js/Tags/Event/OnMouseOver.js";
export {OnMouseOut} from "/js/Tags/Event/OnMouseOut.js";
// export class OnMouseOut extends Event { static GetName(){ return "mouseout"; } }
export class OnMouseMove extends Event { static GetName(){ return "mousemove"; } }
export class OnTouchMove extends Event { static GetName(){ return "touchmove"; } }
export class OnTouchStart extends Event { static GetName(){ return "touchstart"; } }
export class OnPointerOver extends Event { static GetName(){ return "pointerover"; } }
export class OnPointerEnter extends Event { static GetName(){ return "pointerenter"; } }
export class OnPointerDown extends Event { static GetName(){ return "pointerdown"; } }
export class OnPointerMove extends Event { static GetName(){ return "pointermove"; } }
export class OnPointerUp extends Event { static GetName(){ return "pointerup"; } }
export class OnPointerCancel extends Event { static GetName(){ return "pointercancel"; } }
export class OnPointerOut extends Event { static GetName(){ return "pointerout"; } }
export class OnPointerLeave extends Event { static GetName(){ return "pointerleave"; } }
export class OnGotPointerCapture extends Event { static GetName(){ return "gotpointercapture"; } }
export class OnLostPointerCapture extends Event { static GetName(){ return "lostpointercapture"; } }
export class OnTimeUpdate extends Event { static GetName(){ return "timeupdate"; } }
export class OnPlay extends Event { static GetName(){ return "play"; } }
export class OnPause extends Event { static GetName(){ return "pause"; } }
export class OnVolumeChange extends Event { static GetName(){ return "volumechange"; } }
export class OnDrop extends Event { static GetName(){ return "drop"; } }
export class OnDragOver extends Event { static GetName(){ return "dragover"; } }
export class OnDragStart extends Event { static GetName(){ return "dragstart"; } }
export class OnDragEnd extends Event { static GetName(){ return "dragend"; } }
export class OnDragEnter extends Event { static GetName(){ return "dragenter"; } }
export class OnDragExit extends Event { static GetName(){ return "dragexit"; } }
export class OnDragLeave extends Event { static GetName(){ return "dragleave"; } }
export class OnVisibilityChange extends Event { static GetName(){ return "visibilitychange"; } }
// export class OnKeyPress extends Event { static GetName(){ return "keypress"; } }
// export class OnKeyDown extends Event { static GetName(){ return "keydown"; } }
// export class OnKeyUp extends Event { static GetName(){ return "keyup"; } }
export {OnKeyPress} from "/js/Tags/Event/OnKeyPress.js";
export {OnKeyDown} from "/js/Tags/Event/OnKeyDown.js";
export {OnKeyUp} from "/js/Tags/Event/OnKeyUp.js";

// This is not exported on purpose
class OnKey extends Event
{
  static GetName(){ return "keypress"; }
  static IsKey(){ return true; }
}

export class OnKeyBackspace extends OnKey { static GetKey(){ return 8; } }
export class OnKeyTab extends OnKey { static GetKey(){ return 9; } }
export class OnKeyEnter extends OnKey { static GetKey(){ return 13; } }
export class OnKeyShift extends OnKey { static GetKey(){ return 16; } }
export class OnKeyCtrl extends OnKey { static GetKey(){ return 17; } }
export class OnKeyAlt extends OnKey { static GetKey(){ return 18; } }
export class OnKeyPause extends OnKey { static GetKey(){ return 19; } }
export class OnKeyCapsLock extends OnKey { static GetKey(){ return 20; } }
export class OnKeyEscape extends OnKey { static GetKey(){ return 27; } }
export class OnKeyPageUp extends OnKey { static GetKey(){ return 33; } } // QUESTION: Or is it 32?
export class OnKeyPageDown extends OnKey { static GetKey(){ return 34; } }
export class OnKeyEnd extends OnKey { static GetKey(){ return 35; } }
export class OnKeyHome extends OnKey { static GetKey(){ return 36; } }
export class OnKeyLeftArrow extends OnKey { static GetKey(){ return 37; } }
export class OnKeyUpArrow extends OnKey { static GetKey(){ return 38; } }
export class OnKeyRightArrow extends OnKey { static GetKey(){ return 39; } }
export class OnKeyDownArrow extends OnKey { static GetKey(){ return 40; } }
export class OnKeyInsert extends OnKey { static GetKey(){ return 45; } }
export class OnKeyDelete extends OnKey { static GetKey(){ return 46; } }
export class OnKey0 extends OnKey { static GetKey(){ return 48; } }
export class OnKey1 extends OnKey { static GetKey(){ return 49; } }
export class OnKey2 extends OnKey { static GetKey(){ return 50; } }
export class OnKey3 extends OnKey { static GetKey(){ return 51; } }
export class OnKey4 extends OnKey { static GetKey(){ return 52; } }
export class OnKey5 extends OnKey { static GetKey(){ return 53; } }
export class OnKey6 extends OnKey { static GetKey(){ return 54; } }
export class OnKey7 extends OnKey { static GetKey(){ return 55; } }
export class OnKey8 extends OnKey { static GetKey(){ return 56; } }
export class OnKey9 extends OnKey { static GetKey(){ return 57; } }
export class OnKeyA extends OnKey { static GetKey(){ return 65; } }
export class OnKeyB extends OnKey { static GetKey(){ return 66; } }
export class OnKeyC extends OnKey { static GetKey(){ return 67; } }
export class OnKeyD extends OnKey { static GetKey(){ return 68; } }
export class OnKeyE extends OnKey { static GetKey(){ return 69; } }
export class OnKeyF extends OnKey { static GetKey(){ return 70; } }
export class OnKeyG extends OnKey { static GetKey(){ return 71; } }
export class OnKeyH extends OnKey { static GetKey(){ return 72; } }
export class OnKeyI extends OnKey { static GetKey(){ return 73; } }
export class OnKeyJ extends OnKey { static GetKey(){ return 74; } }
export class OnKeyK extends OnKey { static GetKey(){ return 75; } }
export class OnKeyL extends OnKey { static GetKey(){ return 76; } }
export class OnKeyM extends OnKey { static GetKey(){ return 77; } }
export class OnKeyN extends OnKey { static GetKey(){ return 78; } }
export class OnKeyO extends OnKey { static GetKey(){ return 79; } }
export class OnKeyP extends OnKey { static GetKey(){ return 80; } }
export class OnKeyQ extends OnKey { static GetKey(){ return 81; } }
export class OnKeyR extends OnKey { static GetKey(){ return 82; } }
export class OnKeyS extends OnKey { static GetKey(){ return 83; } }
export class OnKeyT extends OnKey { static GetKey(){ return 84; } }
export class OnKeyU extends OnKey { static GetKey(){ return 85; } }
export class OnKeyV extends OnKey { static GetKey(){ return 86; } }
export class OnKeyW extends OnKey { static GetKey(){ return 87; } }
export class OnKeyX extends OnKey { static GetKey(){ return 88; } }
export class OnKeyY extends OnKey { static GetKey(){ return 89; } }
export class OnKeyZ extends OnKey { static GetKey(){ return 90; } }
export class OnKeyLeftWindowKey extends OnKey { static GetKey(){ return 91; } }
export class OnKeyRightWindowKey extends OnKey { static GetKey(){ return 92; } }
export class OnKeySelectKey extends OnKey { static GetKey(){ return 93; } }
export class OnKeyNumpad0 extends OnKey { static GetKey(){ return 96; } }
export class OnKeyNumpad1 extends OnKey { static GetKey(){ return 97; } }
export class OnKeyNumpad2 extends OnKey { static GetKey(){ return 98; } }
export class OnKeyNumpad3 extends OnKey { static GetKey(){ return 99; } }
export class OnKeyNumpad4 extends OnKey { static GetKey(){ return 100; } }
export class OnKeyNumpad5 extends OnKey { static GetKey(){ return 101; } }
export class OnKeyNumpad6 extends OnKey { static GetKey(){ return 102; } }
export class OnKeyNumpad7 extends OnKey { static GetKey(){ return 103; } }
export class OnKeyNumpad8 extends OnKey { static GetKey(){ return 104; } }
export class OnKeyNumpad9 extends OnKey { static GetKey(){ return 105; } }
export class OnKeyMultiply extends OnKey { static GetKey(){ return 106; } }
export class OnKeyAdd extends OnKey { static GetKey(){ return 107; } }
export class OnKeySubtract extends OnKey { static GetKey(){ return 109; } }
export class OnKeyDecimalPoint extends OnKey { static GetKey(){ return 110; } }
export class OnKeyDivide extends OnKey { static GetKey(){ return 111; } }
export class OnKeyF1 extends OnKey { static GetKey(){ return 112; } }
export class OnKeyF2 extends OnKey { static GetKey(){ return 113; } }
export class OnKeyF3 extends OnKey { static GetKey(){ return 114; } }
export class OnKeyF4 extends OnKey { static GetKey(){ return 115; } }
export class OnKeyF5 extends OnKey { static GetKey(){ return 116; } }
export class OnKeyF6 extends OnKey { static GetKey(){ return 117; } }
export class OnKeyF7 extends OnKey { static GetKey(){ return 118; } }
export class OnKeyF8 extends OnKey { static GetKey(){ return 119; } }
export class OnKeyF9 extends OnKey { static GetKey(){ return 120; } }
export class OnKeyF10 extends OnKey { static GetKey(){ return 121; } }
export class OnKeyF11 extends OnKey { static GetKey(){ return 122; } }
export class OnKeyF12 extends OnKey { static GetKey(){ return 123; } }
export class OnKeyNumLock extends OnKey { static GetKey(){ return 144; } }
export class OnKeyScrollLock extends OnKey { static GetKey(){ return 145; } }
export class OnAudioVolumeMute extends OnKey { static GetKey(){ return 173; } }
export class OnAudioVolumeDown extends OnKey { static GetKey(){ return 174; } }
export class OnAudioVolumeUp extends OnKey { static GetKey(){ return 175; } }
export class OnLaunchMediaPlayer extends OnKey { static GetKey(){ return 181; } }
export class OnLaunchApplication1 extends OnKey { static GetKey(){ return 182; } }
export class OnLaunchApplication2 extends OnKey { static GetKey(){ return 183; } }
export class OnKeySemiColon extends OnKey { static GetKey(){ return 186; } }
export class OnKeyEqualSign extends OnKey { static GetKey(){ return 187; } }
export class OnKeyComma extends OnKey { static GetKey(){ return 188; } }
export class OnKeyDash extends OnKey { static GetKey(){ return 189; } }
export class OnKeyPeriod extends OnKey { static GetKey(){ return 190; } }
export class OnKeyForwardSlash extends OnKey { static GetKey(){ return 191; } }
export class OnKeyGraveAccent extends OnKey { static GetKey(){ return 192; } }
export class OnKeyOpenBracket extends OnKey { static GetKey(){ return 219; } }
export class OnKeyBackSlash extends OnKey { static GetKey(){ return 220; } }
export class OnKeyCloseBraket extends OnKey { static GetKey(){ return 221; } }
export class OnKeySingleQuote extends OnKey { static GetKey(){ return 222; } }
