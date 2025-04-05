import {Tag} from "/js/Tag.js";
import {Event} from "/js/Tags/Event.js";

export class Standard extends Event
{
}

Standard.Register();

export class OnAutoComplete extends Standard {} // autocomplete
export class OnAutoCompleteError extends Standard {} // autocompleteerror
export class OnDragExit extends Standard {} // dragexit
export class OnSecurityPolicyViolation extends Standard {} // securitypolicyviolation
export class OnSort extends Standard {} // sort

export class OnSearch extends Standard {} // search
export class OnWebkitAnimationEnd extends Standard {} // webkitanimationend
export class OnWebkitAnimationIteration extends Standard {} // webkitanimationiteration
export class OnWebkitAnimationStart extends Standard {} // webkitanimationstart
export class OnWebkitTransitionEnd extends Standard {} // webkittransitionend
export class OnCancel extends Standard {} // cancel
export class OnCueChange extends Standard {} // cuechange
export class OnInvalid extends Standard {} // invalid
export class OnMouseWheel extends Standard {} // mousewheel
export class OnToggle extends Standard {} // toggle
export class OnGotPointerCapture extends Standard {} // gotpointercapture
export class OnLostPointerCapture extends Standard {} // lostpointercapture
export class OnPointerDown extends Standard {} // pointerdown
export class OnPointerMove extends Standard {} // pointermove
export class OnPointerUp extends Standard {} // pointerup
export class OnPointerCancel extends Standard {} // pointercancel
export class OnPointerOver extends Standard {} // pointerover
export class OnPointerOut extends Standard {} // pointerout
export class OnPointerEnter extends Standard {} // pointerenter
export class OnPointerLeave extends Standard {} // pointerleave
export class OnSelectStart extends Standard {} // selectstart
export class OnSelectionChange extends Standard {} // selectionchange
export class OnHashChange extends Standard {} // hashchange
export class OnLanguageChange extends Standard {} // languagechange
export class OnMessageError extends Standard {} // messageerror
export class OnRejectionHandled extends Standard {} // rejectionhandled
export class OnStorage extends Standard {} // storage
export class OnUnhandledRejection extends Standard {} // unhandledrejection
export class OnAppInstalled extends Standard {} // appinstalled
export class OnBeforeInstallPrompt extends Standard {} // beforeinstallprompt
export class OnFormData extends Standard {} // formdata

// Resource events
export class OnLoadError extends Standard {} // error
export class OnLoadAbort extends Standard {} // abort
export class OnLoad extends Standard {} // load
export class OnBeforeUnload extends Standard {} // beforeunload
export class OnUnload extends Standard {} // unload

// Network events
export class OnOnline extends Standard {} // online
export class OnOffline extends Standard {} // offline

// Focus events
export class OnInput extends Standard {} // input
export class OnFocus extends Standard {} // focus
export class OnBlur extends Standard {} // blur
export class OnChange extends Standard {} // change

// WebSocket events
export class OnSocketOpen extends Standard {} // open
export class OnSocketMessage extends Standard {} // message
export class OnSocketError extends Standard {} // error
export class OnSocketClose extends Standard {} // close

// Session History events
export class OnPageHide extends Standard {} // pagehide
export class OnPageShow extends Standard {} // pageshow
export class OnPopState extends Standard {} // popstate

// CSS Animation events
export class OnAnimationStart extends Standard {} // animationstart
export class OnAnimationCancel extends Standard {} // animationcancel
export class OnAnimationEnd extends Standard {} // animationend
export class OnAnimationIteration extends Standard {} // animationiteration

// CSS Transition events
export class OnTransitionStart extends Standard {} // transitionstart
export class OnTransitionCancel extends Standard {} // transitioncancel
export class OnTransitionEnd extends Standard {} // transitionend
export class OnTransitionRun extends Standard {} // transitionrun

// Form events
export class OnReset extends Standard {} // reset
export class OnSubmit extends Standard {} // submit

// Printing events
export class OnBeforePrint extends Standard {} // beforeprint
export class OnAfterPrint extends Standard {} // afterprint

// Text Composition events
export class OnCompositionStart extends Standard {} // compositionstart
export class OnCompositionUpdate extends Standard {} // compositionupdate
export class OnCompositionEnd extends Standard {} // compositionend

// View events
export class OnFullscreenChange extends Standard {} // fullscreenchange
export class OnFullscreenError extends Standard {} // fullscreenerror
export class OnResize extends Standard {} // resize
export class OnScroll extends Standard {} // scroll

// Clipboard events
export class OnCut extends Standard {} // cut
export class OnCopy extends Standard {} // copy
export class OnPaste extends Standard {} // paste

// Keyboard events
export class OnKeyDown extends Standard {} // keydown
export class OnKeyPress extends Standard {} // keypress
export class OnKeyUp extends Standard {} // keyup

// Mouse events
export class OnAuxClick extends Standard {} // auxclick
export class OnClick extends Standard {} // click
export class OnContextMenu extends Standard {} // contextmenu
export class OnDblClick extends Standard {} // dblclick
export class OnMouseDown extends Standard {} // mousedown
export class OnMouseEnter extends Standard {} // mouseenter
export class OnMouseLeave extends Standard {} // mouseleave
export class OnMouseMove extends Standard {} // mousemove
export class OnMouseOver extends Standard {} // mouseover
export class OnMouseOut extends Standard {} // mouseout
export class OnMouseUp extends Standard {} // mouseup
export class OnPointerLockChange extends Standard {} // pointerlockchange
export class OnPointerLockError extends Standard {} // pointerlockerror
export class OnSelect extends Standard {} // select
export class OnWheel extends Standard {} // wheel

// Drag & Drop events
export class OnDrag extends Standard {} // drag
export class OnDragEnd extends Standard {} // dragend
export class OnDragEnter extends Standard {} // dragenter
export class OnDragStart extends Standard {} // dragstart
export class OnDragLeave extends Standard {} // dragleave
export class OnDragOver extends Standard {} // dragover
export class OnDrop extends Standard {} // drop

// Media events
export class OnAudioProcess extends Standard {} // audioprocess
export class OnCanPlay extends Standard {} // canplay
export class OnCanPlayThrough extends Standard {} // canplaythrough
export class Complete extends Standard {} // complete
export class OnDurationChange extends Standard {} // durationchange
export class OnEmptied extends Standard {} // emptied
export class OnEnded extends Standard {} // ended
export class OnLoadedData extends Standard {} // loadeddata
export class OnLoadedMetadata extends Standard {} // loadedmetadata
export class OnPause extends Standard {} // pause
export class OnPlay extends Standard {} // play
export class OnPlaying extends Standard {} // playing
export class OnRateChange extends Standard {} // ratechange
export class OnSeeked extends Standard {} // seeked
export class OnSeeking extends Standard {} // seeking
export class OnStalled extends Standard {} // stalled
export class OnSuspend extends Standard {} // suspend
export class OnTimeUpdate extends Standard {} // timeupdate
export class OnVolumeChange extends Standard {} // volumechange
export class OnWaiting extends Standard {} // waiting

// Progress events
export class OnProgressAbort extends Standard {} // abort
export class OnProgressError extends Standard {} // error
export class OnProgressLoad extends Standard {} // load
export class OnProgressLoadEnd extends Standard {} // loadend
export class OnProgressLoadStart extends Standard {} // loadstart
export class OnProgressProgress extends Standard {} // progress
export class OnProgressTimeout extends Standard {} // timeout

OnAutoComplete.Register("autocomplete");
OnAutoCompleteError.Register("autocompleteerror");
OnDragExit.Register("dragexit");
OnSecurityPolicyViolation.Register("securitypolicyviolation");
OnSort.Register("sort");
OnSearch.Register("search");
OnWebkitAnimationEnd.Register("webkitanimationend");
OnWebkitAnimationIteration.Register("webkitanimationiteration");
OnWebkitAnimationStart.Register("webkitanimationstart");
OnWebkitTransitionEnd.Register("webkittransitionend");
OnCancel.Register("cancel");
OnCueChange.Register("cuechange");
OnInvalid.Register("invalid");
OnMouseWheel.Register("mousewheel");
OnToggle.Register("toggle");
OnGotPointerCapture.Register("gotpointercapture");
OnLostPointerCapture.Register("lostpointercapture");
OnPointerDown.Register("pointerdown");
OnPointerMove.Register("pointermove");
OnPointerUp.Register("pointerup");
OnPointerCancel.Register("pointercancel");
OnPointerOver.Register("pointerover");
OnPointerOut.Register("pointerout");
OnPointerEnter.Register("pointerenter");
OnPointerLeave.Register("pointerleave");
OnSelectStart.Register("selectstart");
OnSelectionChange.Register("selectionchange");
OnHashChange.Register("hashchange");
OnLanguageChange.Register("languagechange");
OnMessageError.Register("messageerror");
OnRejectionHandled.Register("rejectionhandled");
OnStorage.Register("storage");
OnUnhandledRejection.Register("unhandledrejection");
OnAppInstalled.Register("appinstalled");
OnBeforeInstallPrompt.Register("beforeinstallprompt");
OnFormData.Register("formdata");
OnLoadError.Register("error");
OnLoadAbort.Register("abort");
OnLoad.Register("load");
OnBeforeUnload.Register("beforeunload");
OnUnload.Register("unload");
OnOnline.Register("online");
OnOffline.Register("offline");
OnInput.Register("input");
OnFocus.Register("focus");
OnBlur.Register("blur");
OnChange.Register("change");
OnSocketOpen.Register("open");
OnSocketMessage.Register("message");
OnSocketError.Register("error");
OnSocketClose.Register("close");
OnPageHide.Register("pagehide");
OnPageShow.Register("pageshow");
OnPopState.Register("popstate");
OnAnimationStart.Register("animationstart");
OnAnimationCancel.Register("animationcancel");
OnAnimationEnd.Register("animationend");
OnAnimationIteration.Register("animationiteration");
OnTransitionStart.Register("transitionstart");
OnTransitionCancel.Register("transitioncancel");
OnTransitionEnd.Register("transitionend");
OnTransitionRun.Register("transitionrun");
OnReset.Register("reset");
OnSubmit.Register("submit");
OnBeforePrint.Register("beforeprint");
OnAfterPrint.Register("afterprint");
OnCompositionStart.Register("compositionstart");
OnCompositionUpdate.Register("compositionupdate");
OnCompositionEnd.Register("compositionend");
OnFullscreenChange.Register("fullscreenchange");
OnFullscreenError.Register("fullscreenerror");
OnResize.Register("resize");
OnScroll.Register("scroll");
OnCut.Register("cut");
OnCopy.Register("copy");
OnPaste.Register("paste");
OnKeyDown.Register("keydown");
OnKeyPress.Register("keypress");
OnKeyUp.Register("keyup");
OnAuxClick.Register("auxclick");
OnClick.Register("click");
OnContextMenu.Register("contextmenu");
OnDblClick.Register("dblclick");
OnMouseDown.Register("mousedown");
OnMouseEnter.Register("mouseenter");
OnMouseLeave.Register("mouseleave");
OnMouseMove.Register("mousemove");
OnMouseOver.Register("mouseover");
OnMouseOut.Register("mouseout");
OnMouseUp.Register("mouseup");
OnPointerLockChange.Register("pointerlockchange");
OnPointerLockError.Register("pointerlockerror");
OnSelect.Register("select");
OnWheel.Register("wheel");
OnDrag.Register("drag");
OnDragEnd.Register("dragend");
OnDragEnter.Register("dragenter");
OnDragStart.Register("dragstart");
OnDragLeave.Register("dragleave");
OnDragOver.Register("dragover");
OnDrop.Register("drop");
OnAudioProcess.Register("audioprocess");
OnCanPlay.Register("canplay");
OnCanPlayThrough.Register("canplaythrough");
Complete.Register("complete");
OnDurationChange.Register("durationchange");
OnEmptied.Register("emptied");
OnEnded.Register("ended");
OnLoadedData.Register("loadeddata");
OnLoadedMetadata.Register("loadedmetadata");
OnPause.Register("pause");
OnPlay.Register("play");
OnPlaying.Register("playing");
OnRateChange.Register("ratechange");
OnSeeked.Register("seeked");
OnSeeking.Register("seeking");
OnStalled.Register("stalled");
OnSuspend.Register("suspend");
OnTimeUpdate.Register("timeupdate");
OnVolumeChange.Register("volumechange");
OnWaiting.Register("waiting");
OnProgressAbort.Register("abort");
OnProgressError.Register("error");
OnProgressLoad.Register("load");
OnProgressLoadEnd.Register("loadend");
OnProgressLoadStart.Register("loadstart");
OnProgressProgress.Register("progress");
OnProgressTimeout.Register("timeout");
