import {Tag} from "/js/Tag.js";
import {Event} from "/js/Tags/Event.js";

export class Standard extends Event
{
  static Listen(tag, options)
  {
    const name = this.GetLocalName();
    return tag.AddEventListener(name, options);
  }
}

export class AutoComplete extends Standard { static GetLocalName(){ return "autocomplete"; } }
export class AutoCompleteError extends Standard { static GetLocalName(){ return "autocompleteerror"; } }
export class DragExit extends Standard { static GetLocalName(){ return "dragexit"; } }
export class SecurityPolicyViolation extends Standard { static GetLocalName(){ return "securitypolicyviolation"; } }
export class Sort extends Standard { static GetLocalName(){ return "sort"; } }

export class Search extends Standard { static GetLocalName(){ return "search"; } }
export class WebkitAnimationEnd extends Standard { static GetLocalName(){ return "webkitanimationend"; } }
export class WebkitAnimationIteration extends Standard { static GetLocalName(){ return "webkitanimationiteration"; } }
export class WebkitAnimationStart extends Standard { static GetLocalName(){ return "webkitanimationstart"; } }
export class WebkitTransitionEnd extends Standard { static GetLocalName(){ return "webkittransitionend"; } }
export class Cancel extends Standard { static GetLocalName(){ return "cancel"; } }
export class CueChange extends Standard { static GetLocalName(){ return "cuechange"; } }
export class Invalid extends Standard { static GetLocalName(){ return "invalid"; } }
export class MouseWheel extends Standard { static GetLocalName(){ return "mousewheel"; } }
export class Toggle extends Standard { static GetLocalName(){ return "toggle"; } }
export class GotPointerCapture extends Standard { static GetLocalName(){ return "gotpointercapture"; } }
export class LostPointerCapture extends Standard { static GetLocalName(){ return "lostpointercapture"; } }
export class PointerDown extends Standard { static GetLocalName(){ return "pointerdown"; } }
export class PointerMove extends Standard { static GetLocalName(){ return "pointermove"; } }
export class PointerUp extends Standard { static GetLocalName(){ return "pointerup"; } }
export class PointerCancel extends Standard { static GetLocalName(){ return "pointercancel"; } }
export class PointerOver extends Standard { static GetLocalName(){ return "pointerover"; } }
export class PointerOut extends Standard { static GetLocalName(){ return "pointerout"; } }
export class PointerEnter extends Standard { static GetLocalName(){ return "pointerenter"; } }
export class PointerLeave extends Standard { static GetLocalName(){ return "pointerleave"; } }
export class SelectStart extends Standard { static GetLocalName(){ return "selectstart"; } } }
export class SelectionChange extends Standard { static GetLocalName(){ return "selectionchange"; } }
export class HashChange extends Standard { static GetLocalName(){ return "hashchange"; } }
export class LanguageChange extends Standard { static GetLocalName(){ return "languagechange"; } }
export class MessageError extends Standard { static GetLocalName(){ return "messageerror"; } }
export class RejectionHandled extends Standard { static GetLocalName(){ return "rejectionhandled"; } }
export class Storage extends Standard { static GetLocalName(){ return "storage"; } }
export class UnhandledRejection extends Standard { static GetLocalName(){ return "unhandledrejection"; } }
export class AppInstalled extends Standard { static GetLocalName(){ return "appinstalled"; } }
export class BeforeInstallPrompt extends Standard { static GetLocalName(){ return "beforeinstallprompt"; } }
export class FormData extends Standard { static GetLocalName(){ return "formdata"; } }

// Resource events
export class LoadError extends Standard { static GetLocalName(){ return "error"; } }
export class LoadAbort extends Standard { static GetLocalName(){ return "abort"; } }
export class Load extends Standard { static GetLocalName(){ return "load"; } }
export class BeforeUnload extends Standard { static GetLocalName(){ return "beforeunload"; }
export class Unload extends Standard { static GetLocalName(){ return "unload"; } }

// Network events
export class Online extends Standard { static GetLocalName(){ return "online"; } }
export class Offline extends Standard { static GetLocalName(){ return "offline"; } }

// Focus events
export class Input extends Standard { static GetLocalName(){ return "input"; } }
export class Focus extends Standard { static GetLocalName(){ return "focus"; } }
export class Blur extends Standard { static GetLocalName(){ return "blur"; } }
export class Change extends Standard { static GetLocalName(){ return "change"; } }

// WebSocket events
export class SocketOpen extends Standard { static GetLocalName(){ return "open"; } }
export class SocketMessage extends Standard { static GetLocalName(){ return "message"; } }
export class SocketError extends Standard { static GetLocalName(){ return "error"; } }
export class SocketClose extends Standard { static GetLocalName(){ return "close"; } }

// Session History events
export class PageHide extends Standard { static GetLocalName(){ return "pagehide"; } }
export class PageShow extends Standard { static GetLocalName(){ return "pageshow"; } }
export class PopState extends Standard { static GetLocalName(){ return "popstate"; } }

// CSS Animation events
export class AnimationStart extends Standard { static GetLocalName(){ return "animationstart"; } }
export class AnimationCancel extends Standard { static GetLocalName(){ return "animationcancel"; } }
export class AnimationEnd extends Standard { static GetLocalName(){ return "animationend"; } }
export class AnimationIteration extends Standard { static GetLocalName(){ return "animationiteration"; } }

// CSS Transition events
export class TransitionStart extends Standard { static GetLocalName(){ return "transitionstart"; } }
export class TransitionCancel extends Standard { static GetLocalName(){ return "transitioncancel"; } }
export class TransitionEnd extends Standard { static GetLocalName(){ return "transitionend"; } }
export class TransitionRun extends Standard { static GetLocalName(){ return "transitionrun"; } }

// Form events
export class Reset extends Standard { static GetLocalName(){ return "reset"; } }
export class Submit extends Standard { static GetLocalName(){ return "submit"; } }

// Printing events
export class BeforePrint extends Standard { static GetLocalName(){ return "beforeprint"; } }
export class AfterPrint extends Standard { static GetLocalName(){ return "afterprint"; } }

// Text Composition events
export class CompositionStart extends Standard { static GetLocalName(){ return "compositionstart"; } }
export class CompositionUpdate extends Standard { static GetLocalName(){ return "compositionupdate"; } }
export class CompositionEnd extends Standard { static GetLocalName(){ return "compositionend"; } }

// View events
export class FullscreenChange extends Standard { static GetLocalName(){ return "fullscreenchange"; } }
export class FullscreenError extends Standard { static GetLocalName(){ return "fullscreenerror"; } }
export class Resize extends Standard { static GetLocalName(){ return "resize"; } }
export class Scroll extends Standard { static GetLocalName(){ return "scroll"; } }

// Clipboard events
export class Cut extends Standard { static GetLocalName(){ return "cut"; } }
export class Copy extends Standard { static GetLocalName(){ return "copy"; } }
export class Paste extends Standard { static GetLocalName(){ return "paste"; } }

// Keyboard events
export class KeyDown extends Standard { static GetLocalName(){ return "keydown"; } }
export class KeyPress extends Standard { static GetLocalName(){ return "keypress"; } }
export class KeyUp extends Standard { static GetLocalName(){ return "keyup"; } }

// Mouse events
export class AuxClick extends Standard { static GetLocalName(){ return "auxclick"; } }
export class Click extends Standard { static GetLocalName(){ return "click"; } }
export class ContextMenu extends Standard { static GetLocalName(){ return "contextmenu"; } }
export class DblClick extends Standard { static GetLocalName(){ return "dblclick"; } }
export class MouseDown extends Standard { static GetLocalName(){ return "mousedown"; } }
export class MouseEnter extends Standard { static GetLocalName(){ return "mouseenter"; } }
export class MouseLeave extends Standard { static GetLocalName(){ return "mouseleave"; } }
export class MouseMove extends Standard { static GetLocalName(){ return "mousemove"; } }
export class MouseOver extends Standard { static GetLocalName(){ return "mouseover"; } }
export class MouseOut extends Standard { static GetLocalName(){ return "mouseout"; } }
export class MouseUp extends Standard { static GetLocalName(){ return "mouseup"; } }
export class PointerLockChange extends Standard { static GetLocalName(){ return "pointerlockchange"; } }
export class PointerLockError extends Standard { static GetLocalName(){ return "pointerlockerror"; } }
export class Select extends Standard { static GetLocalName(){ return "select"; } }
export class Wheel extends Standard { static GetLocalName(){ return "wheel"; } }

// Drag & Drop events
export class Drag extends Standard { static GetLocalName(){ return "drag"; } }
export class DragEnd extends Standard { static GetLocalName(){ return "dragend"; } }
export class DragEnter extends Standard { static GetLocalName(){ return "dragenter"; } }
export class DragStart extends Standard { static GetLocalName(){ return "dragstart"; } }
export class DragLeave extends Standard { static GetLocalName(){ return "dragleave"; } }
export class DragOver extends Standard { static GetLocalName(){ return "dragover"; } }
export class Drop extends Standard { static GetLocalName(){ return "drop"; } }

// Media events
export class AudioProcess extends Standard { static GetLocalName(){ return "audioprocess"; } }
export class CanPlay extends Standard { static GetLocalName(){ return "canplay"; } }
export class CanPlayThrough extends Standard { static GetLocalName(){ return "canplaythrough"; } }
export class Complete extends Standard { static GetLocalName(){ return "complete"; } }
export class DurationChange extends Standard { static GetLocalName(){ return "durationchange"; } }
export class Emptied extends Standard { static GetLocalName(){ return "emptied"; } }
export class Ended extends Standard { static GetLocalName(){ return "ended"; } }
export class LoadedData extends Standard { static GetLocalName(){ return "loadeddata"; } }
export class LoadedMetadata extends Standard { static GetLocalName(){ return "loadedmetadata"; } }
export class Pause extends Standard { static GetLocalName(){ return "pause"; } }
export class Play extends Standard { static GetLocalName(){ return "play"; } }
export class Playing extends Standard { static GetLocalName(){ return "playing"; } }
export class RateChange extends Standard { static GetLocalName(){ return "ratechange"; } }
export class Seeked extends Standard { static GetLocalName(){ return "seeked"; } }
export class Seeking extends Standard { static GetLocalName(){ return "seeking"; } }
export class Stalled extends Standard { static GetLocalName(){ return "stalled"; } }
export class Suspend extends Standard { static GetLocalName(){ return "suspend"; } }
export class TimeUpdate extends Standard { static GetLocalName(){ return "timeupdate"; } }
export class VolumeChange extends Standard { static GetLocalName(){ return "volumechange"; } }
export class Waiting extends Standard { static GetLocalName(){ return "waiting"; } }

// Progress events
export class ProgressAbort     extends Standard { static GetLocalName(){ return "abort"; } }
export class ProgressError     extends Standard { static GetLocalName(){ return "error"; } }
export class ProgressLoad      extends Standard { static GetLocalName(){ return "load"; } }
export class ProgressLoadEnd   extends Standard { static GetLocalName(){ return "loadend"; } }
export class ProgressLoadStart extends Standard { static GetLocalName(){ return "loadstart"; } }
export class Progress          extends Standard { static GetLocalName(){ return "progress"; } }
export class ProgressTimeout   extends Standard { static GetLocalName(){ return "timeout"; } }
