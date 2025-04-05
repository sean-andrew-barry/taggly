import {Tag} from "/js/Tag.js";
import {Event} from "/js/Tags/Event.js";

export class Keyboard extends Event
{
}

Keyboard.Register();

export class OnKeyBackspace extends Keyboard {} // 8
export class OnKeyTab extends Keyboard {} // 9
export class OnKeyEnter extends Keyboard {} // 13
export class OnKeyShift extends Keyboard {} // 16
export class OnKeyCtrl extends Keyboard {} // 17
export class OnKeyAlt extends Keyboard {} // 18
export class OnKeyPause extends Keyboard {} // 19
export class OnKeyCapsLock extends Keyboard {} // 20
export class OnKeyEscape extends Keyboard {} // 27
export class OnKeyPageUp extends Keyboard {} // 32 or 33?
export class OnKeyPageDown extends Keyboard {} // 34
export class OnKeyEnd extends Keyboard {} // 35
export class OnKeyHome extends Keyboard {} // 36
export class OnKeyLeftArrow extends Keyboard {} // 37
export class OnKeyUpArrow extends Keyboard {} // 38
export class OnKeyRightArrow extends Keyboard {} // 39
export class OnKeyDownArrow extends Keyboard {} // 40
export class OnKeyInsert extends Keyboard {} // 45
export class OnKeyDelete extends Keyboard {} // 46
export class OnKey0 extends Keyboard {} // 48
export class OnKey1 extends Keyboard {} // 49
export class OnKey2 extends Keyboard {} // 50
export class OnKey3 extends Keyboard {} // 51
export class OnKey4 extends Keyboard {} // 52
export class OnKey5 extends Keyboard {} // 53
export class OnKey6 extends Keyboard {} // 54
export class OnKey7 extends Keyboard {} // 55
export class OnKey8 extends Keyboard {} // 56
export class OnKey9 extends Keyboard {} // 57
export class OnKeyA extends Keyboard {} // 65
export class OnKeyB extends Keyboard {} // 66
export class OnKeyC extends Keyboard {} // 67
export class OnKeyD extends Keyboard {} // 68
export class OnKeyE extends Keyboard {} // 69
export class OnKeyF extends Keyboard {} // 70
export class OnKeyG extends Keyboard {} // 71
export class OnKeyH extends Keyboard {} // 72
export class OnKeyI extends Keyboard {} // 73
export class OnKeyJ extends Keyboard {} // 74
export class OnKeyK extends Keyboard {} // 75
export class OnKeyL extends Keyboard {} // 76
export class OnKeyM extends Keyboard {} // 77
export class OnKeyN extends Keyboard {} // 78
export class OnKeyO extends Keyboard {} // 79
export class OnKeyP extends Keyboard {} // 80
export class OnKeyQ extends Keyboard {} // 81
export class OnKeyR extends Keyboard {} // 82
export class OnKeyS extends Keyboard {} // 83
export class OnKeyT extends Keyboard {} // 84
export class OnKeyU extends Keyboard {} // 85
export class OnKeyV extends Keyboard {} // 86
export class OnKeyW extends Keyboard {} // 87
export class OnKeyX extends Keyboard {} // 88
export class OnKeyY extends Keyboard {} // 89
export class OnKeyZ extends Keyboard {} // 90
export class OnKeyLeftWindowKey extends Keyboard {} // 91
export class OnKeyRightWindowKey extends Keyboard {} // 92
export class OnKeySelectKey extends Keyboard {} // 93
export class OnKeyNumpad0 extends Keyboard {} // 96
export class OnKeyNumpad1 extends Keyboard {} // 97
export class OnKeyNumpad2 extends Keyboard {} // 98
export class OnKeyNumpad3 extends Keyboard {} // 99
export class OnKeyNumpad4 extends Keyboard {} // 100
export class OnKeyNumpad5 extends Keyboard {} // 101
export class OnKeyNumpad6 extends Keyboard {} // 102
export class OnKeyNumpad7 extends Keyboard {} // 103
export class OnKeyNumpad8 extends Keyboard {} // 104
export class OnKeyNumpad9 extends Keyboard {} // 105
export class OnKeyMultiply extends Keyboard {} // 106
export class OnKeyAdd extends Keyboard {} // 107
export class OnKeySubtract extends Keyboard {} // 109
export class OnKeyDecimalPoint extends Keyboard {} // 110
export class OnKeyDivide extends Keyboard {} // 111
export class OnKeyF1 extends Keyboard {} // 112
export class OnKeyF2 extends Keyboard {} // 113
export class OnKeyF3 extends Keyboard {} // 114
export class OnKeyF4 extends Keyboard {} // 115
export class OnKeyF5 extends Keyboard {} // 116
export class OnKeyF6 extends Keyboard {} // 117
export class OnKeyF7 extends Keyboard {} // 118
export class OnKeyF8 extends Keyboard {} // 119
export class OnKeyF9 extends Keyboard {} // 120
export class OnKeyF10 extends Keyboard {} // 121
export class OnKeyF11 extends Keyboard {} // 122
export class OnKeyF12 extends Keyboard {} // 123
export class OnKeyNumLock extends Keyboard {} // 144
export class OnKeyScrollLock extends Keyboard {} // 145
export class OnAudioVolumeMute extends Keyboard {} // 173
export class OnAudioVolumeDown extends Keyboard {} // 174
export class OnAudioVolumeUp extends Keyboard {} // 175
export class OnLaunchMediaPlayer extends Keyboard {} // 181
export class OnLaunchApplication1 extends Keyboard {} // 182
export class OnLaunchApplication2 extends Keyboard {} // 183
export class OnKeySemiColon extends Keyboard {} // 186
export class OnKeyEqualSign extends Keyboard {} // 187
export class OnKeyComma extends Keyboard {} // 188
export class OnKeyDash extends Keyboard {} // 189
export class OnKeyPeriod extends Keyboard {} // 190
export class OnKeyForwardSlash extends Keyboard {} // 191
export class OnKeyGraveAccent extends Keyboard {} // 192
export class OnKeyOpenBracket extends Keyboard {} // 219
export class OnKeyBackSlash extends Keyboard {} // 220
export class OnKeyCloseBraket extends Keyboard {} // 221
export class OnKeySingleQuote extends Keyboard {} // 222

OnKeyBackspace.Register(8);
OnKeyTab.Register(9);
OnKeyEnter.Register(13);
OnKeyShift.Register(16);
OnKeyCtrl.Register(17);
OnKeyAlt.Register(18);
OnKeyPause.Register(19);
OnKeyCapsLock.Register(20);
OnKeyEscape.Register(27);
OnKeyPageUp.Register(32);
OnKeyPageUp.Register(33);
OnKeyPageDown.Register(34);
OnKeyEnd.Register(35);
OnKeyHome.Register(36);
OnKeyLeftArrow.Register(37);
OnKeyUpArrow.Register(38);
OnKeyRightArrow.Register(39);
OnKeyDownArrow.Register(40);
OnKeyInsert.Register(45);
OnKeyDelete.Register(46);
OnKey0.Register(48);
OnKey1.Register(49);
OnKey2.Register(50);
OnKey3.Register(51);
OnKey4.Register(52);
OnKey5.Register(53);
OnKey6.Register(54);
OnKey7.Register(55);
OnKey8.Register(56);
OnKey9.Register(57);
OnKeyA.Register(65);
OnKeyB.Register(66);
OnKeyC.Register(67);
OnKeyD.Register(68);
OnKeyE.Register(69);
OnKeyF.Register(70);
OnKeyG.Register(71);
OnKeyH.Register(72);
OnKeyI.Register(73);
OnKeyJ.Register(74);
OnKeyK.Register(75);
OnKeyL.Register(76);
OnKeyM.Register(77);
OnKeyN.Register(78);
OnKeyO.Register(79);
OnKeyP.Register(80);
OnKeyQ.Register(81);
OnKeyR.Register(82);
OnKeyS.Register(83);
OnKeyT.Register(84);
OnKeyU.Register(85);
OnKeyV.Register(86);
OnKeyW.Register(87);
OnKeyX.Register(88);
OnKeyY.Register(89);
OnKeyZ.Register(90);
OnKeyLeftWindowKey.Register(91);
OnKeyRightWindowKey.Register(92);
OnKeySelectKey.Register(93);
OnKeyNumpad0.Register(96);
OnKeyNumpad1.Register(97);
OnKeyNumpad2.Register(98);
OnKeyNumpad3.Register(99);
OnKeyNumpad4.Register(100);
OnKeyNumpad5.Register(101);
OnKeyNumpad6.Register(102);
OnKeyNumpad7.Register(103);
OnKeyNumpad8.Register(104);
OnKeyNumpad9.Register(105);
OnKeyMultiply.Register(106);
OnKeyAdd.Register(107);
OnKeySubtract.Register(109);
OnKeyDecimalPoint.Register(110);
OnKeyDivide.Register(111);
OnKeyF1.Register(112);
OnKeyF2.Register(113);
OnKeyF3.Register(114);
OnKeyF4.Register(115);
OnKeyF5.Register(116);
OnKeyF6.Register(117);
OnKeyF7.Register(118);
OnKeyF8.Register(119);
OnKeyF9.Register(120);
OnKeyF10.Register(121);
OnKeyF11.Register(122);
OnKeyF12.Register(123);
OnKeyNumLock.Register(144);
OnKeyScrollLock.Register(145);
OnAudioVolumeMute.Register(173);
OnAudioVolumeDown.Register(174);
OnAudioVolumeUp.Register(175);
OnLaunchMediaPlayer.Register(181);
OnLaunchApplication1.Register(182);
OnLaunchApplication2.Register(183);
OnKeySemiColon.Register(186);
OnKeyEqualSign.Register(187);
OnKeyComma.Register(188);
OnKeyDash.Register(189);
OnKeyPeriod.Register(190);
OnKeyForwardSlash.Register(191);
OnKeyGraveAccent.Register(192);
OnKeyOpenBracket.Register(219);
OnKeyBackSlash.Register(220);
OnKeyCloseBraket.Register(221);
OnKeySingleQuote.Register(222);
