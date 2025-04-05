import {Styles} from "/js/Tag/Styles.js";
import * as E from "/js/Events.js";

export class Events extends Styles
{
  OnMutation(fn, o){ return this.On(E.Mutation, fn, o); }
  OnRender(fn, o){ return this.On(E.Render, fn, o); }
  OnConnect(fn, o){ return this.On(E.Connect, fn, o); }
  OnDisconnect(fn, o){ return this.On(E.Disconnect, fn, o); }
  OnMobile(fn, o){ return this.On(E.Mobile, fn, o); }
  OnTablet(fn, o){ return this.On(E.Tablet, fn, o); }
  OnTouch(fn, o){ return this.On(E.Touch, fn, o); }
  OnDesktop(fn, o){ return this.On(E.Desktop, fn, o); }
  OnWidescreen(fn, o){ return this.On(E.Widescreen, fn, o); }
  OnFullHD(fn, o){ return this.On(E.FullHD, fn, o); }
  OnNotMobile(fn, o){ return this.On(E.NotMobile, fn, o); }
  OnNotTablet(fn, o){ return this.On(E.NotTablet, fn, o); }
  OnNotDesktop(fn, o){ return this.On(E.NotDesktop, fn, o); }
  OnNotWidescreen(fn, o){ return this.On(E.NotWidescreen, fn, o); }
  OnNotFullHD(fn, o){ return this.On(E.NotFullHD, fn, o); }
  OnFullViewEnter(fn, o){ return this.On(E.FullViewEnter, fn, o); }
  OnFullViewLeave(fn, o){ return this.On(E.FullViewLeave, fn, o); }
  OnViewEnter(fn, o){ return this.On(E.ViewEnter, fn, o); }
  OnViewLeave(fn, o){ return this.On(E.ViewLeave, fn, o); }
  OnAnimationPlay(fn, o){ return this.On(E.AnimationPlay, fn, o); }
  OnAnimationCancel(fn, o){ return this.On(E.AnimationCancel, fn, o); }
  OnAnimationFinish(fn, o){ return this.On(E.AnimationFinish, fn, o); }
  OnAnimationReverse(fn, o){ return this.On(E.AnimationReverse, fn, o); }
  OnAnimationPause(fn, o){ return this.On(E.AnimationPause, fn, o); }

  OnAnimationStart(fn, o){ return this.On(E.Animationstart, fn, o); }
  OnAnimationEnd(fn, o){ return this.On(E.Animationend, fn, o); }
  OnAnimationIteration(fn, o){ return this.On(E.Animationiteration, fn, o); }

  OnLoad(fn, o){ return this.On(E.Load, fn, o); }

  OnInput(fn, o){ return this.On(E.Input, fn, o); }
  OnFocus(fn, o){ return this.On(E.Focus, fn, o); }
  OnBlur(fn, o){ return this.On(E.Blur, fn, o); }
  OnChange(fn, o){ return this.On(E.Change, fn, o); }
  OnSubmit(fn, o){ return this.On(E.Submit, fn, o); }

  // Mouse Events
  OnClick(fn, o){ return this.On(E.Click, fn, o); }
  OnContextMenu(fn, o){ return this.On(E.Contextmenu, fn, o); }
  OnDoubleClick(fn, o){ return this.On(E.Dblclick, fn, o); }
  OnMouseDown(fn, o){ return this.On(E.Mousedown, fn, o); }
  OnMouseUp(fn, o){ return this.On(E.Mouseup, fn, o); }
  OnMouseOver(fn, o){ return this.On(E.Mouseover, fn, o); }
  OnMouseOut(fn, o){ return this.On(E.Mouseout, fn, o); }
  OnMouseMove(fn, o){ return this.On(E.Mousemove, fn, o); }
  OnTouchMove(fn, o){ return this.On(E.Touchmove, fn, o); }
  OnTouchStart(fn, o){ return this.On(E.Touchstart, fn, o); }
  OnWheel(fn, o){ return this.On(E.Wheel, fn, o); }

  OnPointerOver(fn, o){ return this.On(E.Pointerover, fn, o); }
  OnPointerEnter(fn, o){ return this.On(E.Pointerenter, fn, o); }
  OnPointerDown(fn, o){ return this.On(E.Pointerdown, fn, o); }
  OnPointerMove(fn, o){ return this.On(E.Pointermove, fn, o); }
  OnPointerUp(fn, o){ return this.On(E.Pointerup, fn, o); }
  OnPointerCancel(fn, o){ return this.On(E.Pointercancel, fn, o); }
  OnPointerOut(fn, o){ return this.On(E.Pointerout, fn, o); }
  OnPointerLeave(fn, o){ return this.On(E.Pointerleave, fn, o); }
  OnGotPointerCapture(fn, o){ return this.On(E.Gotpointercapture, fn, o); }
  OnLostPointerCapture(fn, o){ return this.On(E.Lostpointercapture, fn, o); }

  OnVisibilityChange(fn, o){ return this.On(E.Visibilitychange, fn, o); }
  OnTimeUpdate(fn, o){ return this.On(E.Timeupdate, fn, o); }
  OnPlay(fn, o){ return this.On(E.Play, fn, o); }
  OnPause(fn, o){ return this.On(E.Pause, fn, o); }
  OnVolumeChange(fn, o){ return this.On(E.Volumechange, fn, o); }
  OnDrop(fn, o){ return this.On(E.Drop, fn, o); }
  OnDragOver(fn, o){ return this.On(E.Dragover, fn, o); }
  OnDragStart(fn, o){ return this.On(E.Dragstart, fn, o); }
  OnDragEnd(fn, o){ return this.On(E.Dragend, fn, o); }
  OnDragEnter(fn, o){ return this.On(E.Dragenter, fn, o); }
  OnDragExit(fn, o){ return this.On(E.Dragexit, fn, o); }
  OnDragLeave(fn, o){ return this.On(E.Dragleave, fn, o); }




  OnMutation(fn, o){ return this.On(E.Mutation, fn, o); }
  OnRender(fn, o){ return this.On(E.Render, fn, o); }
  OnConnect(fn, o){ return this.On(E.Connect, fn, o); }
  OnDisconnect(fn, o){ return this.On(E.Disconnect, fn, o); }
  OnFirstConnect(fn, o){ return this.On(E.FirstConnect, fn, o); }
  OnFirstDisconnect(fn, o){ return this.On(E.FirstDisconnect, fn, o); }
  OnReflow(fn, o){ return this.On(E.Reflow, fn, o); }
  OnLog(fn, o){ return this.On(E.Log, fn, o); }
  OnWarn(fn, o){ return this.On(E.Warn, fn, o); }
  OnError(fn, o){ return this.On(E.Error, fn, o); }
  OnDebug(fn, o){ return this.On(E.Debug, fn, o); }
  OnMobile(fn, o){ return this.On(E.Mobile, fn, o); }
  OnTablet(fn, o){ return this.On(E.Tablet, fn, o); }
  OnTouch(fn, o){ return this.On(E.Touch, fn, o); }
  OnDesktop(fn, o){ return this.On(E.Desktop, fn, o); }
  OnWidescreen(fn, o){ return this.On(E.Widescreen, fn, o); }
  OnFullHD(fn, o){ return this.On(E.FullHD, fn, o); }
  OnNotMobile(fn, o){ return this.On(E.NotMobile, fn, o); }
  OnNotTablet(fn, o){ return this.On(E.NotTablet, fn, o); }
  OnNotDesktop(fn, o){ return this.On(E.NotDesktop, fn, o); }
  OnNotWidescreen(fn, o){ return this.On(E.NotWidescreen, fn, o); }
  OnNotFullHD(fn, o){ return this.On(E.NotFullHD, fn, o); }
  OnFullViewEnter(fn, o){ return this.On(E.FullViewEnter, fn, o); }
  OnFullViewLeave(fn, o){ return this.On(E.FullViewLeave, fn, o); }
  OnViewEnter(fn, o){ return this.On(E.ViewEnter, fn, o); }
  OnViewLeave(fn, o){ return this.On(E.ViewLeave, fn, o); }
  OnAnimationPlay(fn, o){ return this.On(E.AnimationPlay, fn, o); }
  OnAnimationCancel(fn, o){ return this.On(E.AnimationCancel, fn, o); }
  OnAnimationFinish(fn, o){ return this.On(E.AnimationFinish, fn, o); }
  OnAnimationReverse(fn, o){ return this.On(E.AnimationReverse, fn, o); }
  OnAnimationPause(fn, o){ return this.On(E.AnimationPause, fn, o); }
  OnAnimationStart(fn, o){ return this.On(E.Animationstart, fn, o); }
  OnAnimationEnd(fn, o){ return this.On(E.Animationend, fn, o); }
  OnAnimationIteration(fn, o){ return this.On(E.Animationiteration, fn, o); }
  OnLoad(fn, o){ return this.On(E.Load, fn, o); }
  OnInput(fn, o){ return this.On(E.Input, fn, o); }
  OnFocus(fn, o){ return this.On(E.Focus, fn, o); }
  OnBlur(fn, o){ return this.On(E.Blur, fn, o); }
  OnChange(fn, o){ return this.On(E.Change, fn, o); }
  OnSubmit(fn, o){ return this.On(E.Submit, fn, o); }

  // Mouse Events
  OnClick(fn, o){ return this.On(E.Click, fn, o); }
  OnContextMenu(fn, o){ return this.On(E.Contextmenu, fn, o); }
  OnDoubleClick(fn, o){ return this.On(E.Dblclick, fn, o); }
  OnMouseDown(fn, o){ return this.On(E.Mousedown, fn, o); }
  OnMouseUp(fn, o){ return this.On(E.Mouseup, fn, o); }
  OnMouseOver(fn, o){ return this.On(E.Mouseover, fn, o); }
  OnMouseOut(fn, o){ return this.On(E.Mouseout, fn, o); }
  OnMouseMove(fn, o){ return this.On(E.Mousemove, fn, o); }
  OnTouchMove(fn, o){ return this.On(E.Touchmove, fn, o); }
  OnTouchStart(fn, o){ return this.On(E.Touchstart, fn, o); }
  OnWheel(fn, o){ return this.On(E.Wheel, fn, o); }

  OnPointerOver(fn, o){ return this.On(E.Pointerover, fn, o); }
  OnPointerEnter(fn, o){ return this.On(E.Pointerenter, fn, o); }
  OnPointerDown(fn, o){ return this.On(E.Pointerdown, fn, o); }
  OnPointerMove(fn, o){ return this.On(E.Pointermove, fn, o); }
  OnPointerUp(fn, o){ return this.On(E.Pointerup, fn, o); }
  OnPointerCancel(fn, o){ return this.On(E.Pointercancel, fn, o); }
  OnPointerOut(fn, o){ return this.On(E.Pointerout, fn, o); }
  OnPointerLeave(fn, o){ return this.On(E.Pointerleave, fn, o); }
  OnGotPointerCapture(fn, o){ return this.On(E.Gotpointercapture, fn, o); }
  OnLostPointerCapture(fn, o){ return this.On(E.Lostpointercapture, fn, o); }

  OnVisibilityChange(fn, o){ return this.On(E.Visibilitychange, fn, o); }

  // Video events
  OnTimeUpdate(fn, o){ return this.On(E.Timeupdate, fn, o); }
  OnPlay(fn, o){ return this.On(E.Play, fn, o); }
  OnPause(fn, o){ return this.On(E.Pause, fn, o); }
  OnVolumeChange(fn, o){ return this.On(E.Volumechange, fn, o); }

  // Drag and drop events
  OnDrop(fn, o){ return this.On(E.Drop, fn, o); }
  OnDragOver(fn, o){ return this.On(E.Dragover, fn, o); }
  OnDragStart(fn, o){ return this.On(E.Dragstart, fn, o); }
  OnDragEnd(fn, o){ return this.On(E.Dragend, fn, o); }
  OnDragEnter(fn, o){ return this.On(E.Dragenter, fn, o); }
  OnDragExit(fn, o){ return this.On(E.Dragexit, fn, o); }
  OnDragLeave(fn, o){ return this.On(E.Dragleave, fn, o); }

  // OnKeyPress(fn, o){ return this.On(E.Keypress, fn, o); }
  // OnKeyDown(fn, o){ return this.On(E.Keydown, fn, o); }
  // OnKeyUp(fn, o){ return this.On(E.Keyup, fn, o); }

  // Keyboard events
  OnKeyBackspace(fn, o){ return this.OnKey(8, fn, o); }
  OnKeyTab(fn, o){ return this.OnKey(9, fn, o); }
  OnKeyEnter(fn, o){ return this.OnKey(13, fn, o); }
  OnKeyShift(fn, o){ return this.OnKey(16, fn, o); }
  OnKeyCtrl(fn, o){ return this.OnKey(17, fn, o); }
  OnKeyAlt(fn, o){ return this.OnKey(18, fn, o); }
  OnKeyPause(fn, o){ return this.OnKey(19, fn, o); }
  OnKeyCapsLock(fn, o){ return this.OnKey(20, fn, o); }
  OnKeyEscape(fn, o){ return this.OnKey(27, fn, o); }
  OnKeySpaceBar(fn, o){ return this.OnKey(32, fn, o); }
  OnKeyPageUp(fn, o){ return this.OnKey(33, fn, o); }
  OnKeyPageDown(fn, o){ return this.OnKey(34, fn, o); }
  OnKeyEnd(fn, o){ return this.OnKey(35, fn, o); }
  OnKeyHome(fn, o){ return this.OnKey(36, fn, o); }
  OnKeyLeftArrow(fn, o){ return this.OnKey(37, fn, o); }
  OnKeyUpArrow(fn, o){ return this.OnKey(38, fn, o); }
  OnKeyRightArrow(fn, o){ return this.OnKey(39, fn, o); }
  OnKeyDownArrow(fn, o){ return this.OnKey(40, fn, o); }
  OnKeyInsert(fn, o){ return this.OnKey(45, fn, o); }
  OnKeyDelete(fn, o){ return this.OnKey(46, fn, o); }
  OnKey0(fn, o){ return this.OnKey(48, fn, o); }
  OnKey1(fn, o){ return this.OnKey(49, fn, o); }
  OnKey2(fn, o){ return this.OnKey(50, fn, o); }
  OnKey3(fn, o){ return this.OnKey(51, fn, o); }
  OnKey4(fn, o){ return this.OnKey(52, fn, o); }
  OnKey5(fn, o){ return this.OnKey(53, fn, o); }
  OnKey6(fn, o){ return this.OnKey(54, fn, o); }
  OnKey7(fn, o){ return this.OnKey(55, fn, o); }
  OnKey8(fn, o){ return this.OnKey(56, fn, o); }
  OnKey9(fn, o){ return this.OnKey(57, fn, o); }
  OnKeyA(fn, o){ return this.OnKey(65, fn, o); }
  OnKeyB(fn, o){ return this.OnKey(66, fn, o); }
  OnKeyC(fn, o){ return this.OnKey(67, fn, o); }
  OnKeyD(fn, o){ return this.OnKey(68, fn, o); }
  OnKeyE(fn, o){ return this.OnKey(69, fn, o); }
  OnKeyF(fn, o){ return this.OnKey(70, fn, o); }
  OnKeyG(fn, o){ return this.OnKey(71, fn, o); }
  OnKeyH(fn, o){ return this.OnKey(72, fn, o); }
  OnKeyI(fn, o){ return this.OnKey(73, fn, o); }
  OnKeyJ(fn, o){ return this.OnKey(74, fn, o); }
  OnKeyK(fn, o){ return this.OnKey(75, fn, o); }
  OnKeyL(fn, o){ return this.OnKey(76, fn, o); }
  OnKeyM(fn, o){ return this.OnKey(77, fn, o); }
  OnKeyN(fn, o){ return this.OnKey(78, fn, o); }
  OnKeyO(fn, o){ return this.OnKey(79, fn, o); }
  OnKeyP(fn, o){ return this.OnKey(80, fn, o); }
  OnKeyQ(fn, o){ return this.OnKey(81, fn, o); }
  OnKeyR(fn, o){ return this.OnKey(82, fn, o); }
  OnKeyS(fn, o){ return this.OnKey(83, fn, o); }
  OnKeyT(fn, o){ return this.OnKey(84, fn, o); }
  OnKeyU(fn, o){ return this.OnKey(85, fn, o); }
  OnKeyV(fn, o){ return this.OnKey(86, fn, o); }
  OnKeyW(fn, o){ return this.OnKey(87, fn, o); }
  OnKeyX(fn, o){ return this.OnKey(88, fn, o); }
  OnKeyY(fn, o){ return this.OnKey(89, fn, o); }
  OnKeyZ(fn, o){ return this.OnKey(90, fn, o); }
  OnKeyLeftWindowKey(fn, o){ return this.OnKey(91, fn, o); }
  OnKeyRightWindowKey(fn, o){ return this.OnKey(92, fn, o); }
  OnKeySelectKey(fn, o){ return this.OnKey(93, fn, o); }
  OnKeyNumpad0(fn, o){ return this.OnKey(96, fn, o); }
  OnKeyNumpad1(fn, o){ return this.OnKey(97, fn, o); }
  OnKeyNumpad2(fn, o){ return this.OnKey(98, fn, o); }
  OnKeyNumpad3(fn, o){ return this.OnKey(99, fn, o); }
  OnKeyNumpad4(fn, o){ return this.OnKey(100, fn, o); }
  OnKeyNumpad5(fn, o){ return this.OnKey(101, fn, o); }
  OnKeyNumpad6(fn, o){ return this.OnKey(102, fn, o); }
  OnKeyNumpad7(fn, o){ return this.OnKey(103, fn, o); }
  OnKeyNumpad8(fn, o){ return this.OnKey(104, fn, o); }
  OnKeyNumpad9(fn, o){ return this.OnKey(105, fn, o); }
  OnKeyMultiply(fn, o){ return this.OnKey(106, fn, o); }
  OnKeyAdd(fn, o){ return this.OnKey(107, fn, o); }
  OnKeySubtract(fn, o){ return this.OnKey(109, fn, o); }
  OnKeyDecimalPoint(fn, o){ return this.OnKey(110, fn, o); }
  OnKeyDivide(fn, o){ return this.OnKey(111, fn, o); }
  OnKeyF1(fn, o){ return this.OnKey(112, fn, o); }
  OnKeyF2(fn, o){ return this.OnKey(113, fn, o); }
  OnKeyF3(fn, o){ return this.OnKey(114, fn, o); }
  OnKeyF4(fn, o){ return this.OnKey(115, fn, o); }
  OnKeyF5(fn, o){ return this.OnKey(116, fn, o); }
  OnKeyF6(fn, o){ return this.OnKey(117, fn, o); }
  OnKeyF7(fn, o){ return this.OnKey(118, fn, o); }
  OnKeyF8(fn, o){ return this.OnKey(119, fn, o); }
  OnKeyF9(fn, o){ return this.OnKey(120, fn, o); }
  OnKeyF10(fn, o){ return this.OnKey(121, fn, o); }
  OnKeyF11(fn, o){ return this.OnKey(122, fn, o); }
  OnKeyF12(fn, o){ return this.OnKey(123, fn, o); }
  OnKeyNumLock(fn, o){ return this.OnKey(144, fn, o); }
  OnKeyScrollLock(fn, o){ return this.OnKey(145, fn, o); }
  OnAudioVolumeMute(fn, o){ return this.OnKey(173, fn, o); }
  OnAudioVolumeDown(fn, o){ return this.OnKey(174, fn, o); }
  OnAudioVolumeUp(fn, o){ return this.OnKey(175, fn, o); }
  OnLaunchMediaPlayer(fn, o){ return this.OnKey(181, fn, o); }
  OnLaunchApplication1(fn, o){ return this.OnKey(182, fn, o); }
  OnLaunchApplication2(fn, o){ return this.OnKey(183, fn, o); }
  OnKeySemiColon(fn, o){ return this.OnKey(186, fn, o); }
  OnKeyEqualSign(fn, o){ return this.OnKey(187, fn, o); }
  OnKeyComma(fn, o){ return this.OnKey(188, fn, o); }
  OnKeyDash(fn, o){ return this.OnKey(189, fn, o); }
  OnKeyPeriod(fn, o){ return this.OnKey(190, fn, o); }
  OnKeyForwardSlash(fn, o){ return this.OnKey(191, fn, o); }
  OnKeyGraveAccent(fn, o){ return this.OnKey(192, fn, o); }
  OnKeyOpenBracket(fn, o){ return this.OnKey(219, fn, o); }
  OnKeyBackSlash(fn, o){ return this.OnKey(220, fn, o); }
  OnKeyCloseBraket(fn, o){ return this.OnKey(221, fn, o); }
  OnKeySingleQuote(fn, o){ return this.OnKey(222, fn, o); }
}
