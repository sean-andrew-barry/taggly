export class Keyboard
{
  OnKeyBackspace(){}
  OnKeySpace(){}
  OnKeyTab(){}
  OnKeyEnter(){}
  OnKeyShift(){}
  OnKeyCtrl(){}
  OnKeyAlt(){}
  OnKeyPause(){}
  OnKeyCapsLock(){}
  OnKeyEscape(){}
  OnKeyPageUp(){}
  OnKeyPageUp(){}
  OnKeyPageDown(){}
  OnKeyEnd(){}
  OnKeyHome(){}
  OnKeyLeftArrow(){}
  OnKeyUpArrow(){}
  OnKeyRightArrow(){}
  OnKeyDownArrow(){}
  OnKeyInsert(){}
  OnKeyDelete(){}
  OnKey0(){}
  OnKey1(){}
  OnKey2(){}
  OnKey3(){}
  OnKey4(){}
  OnKey5(){}
  OnKey6(){}
  OnKey7(){}
  OnKey8(){}
  OnKey9(){}
  OnKeyA(){}
  OnKeyB(){}
  OnKeyC(key){ if (key.ctrl) global.process.exit(); }
  OnKeyD(){}
  OnKeyE(){}
  OnKeyF(){}
  OnKeyG(){}
  OnKeyH(){}
  OnKeyI(){}
  OnKeyJ(){}
  OnKeyK(){}
  OnKeyL(){}
  OnKeyM(){}
  OnKeyN(){}
  OnKeyO(){}
  OnKeyP(){}
  OnKeyQ(){}
  OnKeyR(){}
  OnKeyS(){}
  OnKeyT(){}
  OnKeyU(){}
  OnKeyV(){}
  OnKeyW(){}
  OnKeyX(){}
  OnKeyY(){}
  OnKeyZ(){}
  OnKeyLeftWindowKey(){}
  OnKeyRightWindowKey(){}
  OnKeySelectKey(){}
  OnKeyNumpad0(){}
  OnKeyNumpad1(){}
  OnKeyNumpad2(){}
  OnKeyNumpad3(){}
  OnKeyNumpad4(){}
  OnKeyNumpad5(){}
  OnKeyNumpad6(){}
  OnKeyNumpad7(){}
  OnKeyNumpad8(){}
  OnKeyNumpad9(){}
  OnKeyMultiply(){}
  OnKeyAdd(){}
  OnKeySubtract(){}
  OnKeyDecimalPoint(){}
  OnKeyDivide(){}
  OnKeyF1(){}
  OnKeyF2(){}
  OnKeyF3(){}
  OnKeyF4(){}
  OnKeyF5(){}
  OnKeyF6(){}
  OnKeyF7(){}
  OnKeyF8(){}
  OnKeyF9(){}
  OnKeyF10(){}
  OnKeyF11(){}
  OnKeyF12(){}
  OnKeyNumLock(){}
  OnKeyScrollLock(){}
  OnAudioVolumeMute(){}
  OnAudioVolumeDown(){}
  OnAudioVolumeUp(){}
  OnLaunchMediaPlayer(){}
  OnLaunchApplication1(){}
  OnLaunchApplication2(){}
  OnKeySemiColon(){}
  OnKeyColon(){}
  OnKeyEqualSign(){}
  OnKeyComma(){}
  OnKeyDash(){}
  OnKeyPeriod(){}
  OnKeyForwardSlash(){}
  OnKeyGraveAccent(){}
  OnKeyOpenBracket(){}
  OnKeyBackSlash(){}
  OnKeyCloseBraket(){}
  OnKeySingleQuote(){}
  OnKeyDoubleQuote(){}
  OnKeyBackQuote(){}

  OnKeyUnknown(key)
  {
    console.log("Unknown key", key);
  }

  OnKey(raw, key)
  {
    key.alt = key.meta;
    key.raw = raw;
    // console.log(this.#capturing, "OnKey", key);

    if (this.#capturing === true)
    {
      return;
    }

    switch (key.name)
    {
      case "backspace": return this.OnKeyBackspace(key);
      case "space": return this.OnKeySpace(key);
      case "tab": return this.OnKeyTab(key);
      case "enter": return this.OnKeyEnter(key);
      case "return": return this.OnKeyEnter(key);
      case "shift": return this.OnKeyShift(key);
      case "ctrl": return this.OnKeyCtrl(key);
      case "alt": return this.OnKeyAlt(key);
      case "pause": return this.OnKeyPause(key);
      case "capslock": return this.OnKeyCapsLock(key);
      case "escape": return this.OnKeyEscape(key);
      case "pageup": return this.OnKeyPageUp(key);
      case "pageup": return this.OnKeyPageUp(key);
      case "pagedown": return this.OnKeyPageDown(key);
      case "end": return this.OnKeyEnd(key);
      case "home": return this.OnKeyHome(key);
      case "left": return this.OnKeyLeftArrow(key);
      case "up": return this.OnKeyUpArrow(key);
      case "right": return this.OnKeyRightArrow(key);
      case "down": return this.OnKeyDownArrow(key);
      case "insert": return this.OnKeyInsert(key);
      case "delete": return this.OnKeyDelete(key);
      case "0": return this.OnKey0(key);
      case "1": return this.OnKey1(key);
      case "2": return this.OnKey2(key);
      case "3": return this.OnKey3(key);
      case "4": return this.OnKey4(key);
      case "5": return this.OnKey5(key);
      case "6": return this.OnKey6(key);
      case "7": return this.OnKey7(key);
      case "8": return this.OnKey8(key);
      case "9": return this.OnKey9(key);
      case "a": return this.OnKeyA(key);
      case "b": return this.OnKeyB(key);
      case "c": return this.OnKeyC(key);
      case "d": return this.OnKeyD(key);
      case "e": return this.OnKeyE(key);
      case "f": return this.OnKeyF(key);
      case "g": return this.OnKeyG(key);
      case "h": return this.OnKeyH(key);
      case "i": return this.OnKeyI(key);
      case "j": return this.OnKeyJ(key);
      case "k": return this.OnKeyK(key);
      case "l": return this.OnKeyL(key);
      case "m": return this.OnKeyM(key);
      case "n": return this.OnKeyN(key);
      case "o": return this.OnKeyO(key);
      case "p": return this.OnKeyP(key);
      case "q": return this.OnKeyQ(key);
      case "r": return this.OnKeyR(key);
      case "s": return this.OnKeyS(key);
      case "t": return this.OnKeyT(key);
      case "u": return this.OnKeyU(key);
      case "v": return this.OnKeyV(key);
      case "w": return this.OnKeyW(key);
      case "x": return this.OnKeyX(key);
      case "y": return this.OnKeyY(key);
      case "z": return this.OnKeyZ(key);
      case "leftwindowkey": return this.OnKeyLeftWindowKey(key);
      case "rightwindowkey": return this.OnKeyRightWindowKey(key);
      case "selectkey": return this.OnKeySelectKey(key);
      case "numpad0": return this.OnKeyNumpad0(key);
      case "numpad1": return this.OnKeyNumpad1(key);
      case "numpad2": return this.OnKeyNumpad2(key);
      case "numpad3": return this.OnKeyNumpad3(key);
      case "numpad4": return this.OnKeyNumpad4(key);
      case "numpad5": return this.OnKeyNumpad5(key);
      case "numpad6": return this.OnKeyNumpad6(key);
      case "numpad7": return this.OnKeyNumpad7(key);
      case "numpad8": return this.OnKeyNumpad8(key);
      case "numpad9": return this.OnKeyNumpad9(key);
      case "multiply": return this.OnKeyMultiply(key);
      case "add": return this.OnKeyAdd(key);
      case "subtract": return this.OnKeySubtract(key);
      case "decimalpoint": return this.OnKeyDecimalPoint(key);
      case "divide": return this.OnKeyDivide(key);
      case "f1": return this.OnKeyF1(key);
      case "f2": return this.OnKeyF2(key);
      case "f3": return this.OnKeyF3(key);
      case "f4": return this.OnKeyF4(key);
      case "f5": return this.OnKeyF5(key);
      case "f6": return this.OnKeyF6(key);
      case "f7": return this.OnKeyF7(key);
      case "f8": return this.OnKeyF8(key);
      case "f9": return this.OnKeyF9(key);
      case "f10": return this.OnKeyF10(key);
      case "f11": return this.OnKeyF11(key);
      case "f12": return this.OnKeyF12(key);
      case "numlock": return this.OnKeyNumLock(key);
      case "scrolllock": return this.OnKeyScrollLock(key);
      case "volumemute": return this.OnAudioVolumeMute(key);
      case "volumedown": return this.OnAudioVolumeDown(key);
      case "volumeup": return this.OnAudioVolumeUp(key);
      case "mediaplayer": return this.OnLaunchMediaPlayer(key);
      case "application1": return this.OnLaunchApplication1(key);
      case "application2": return this.OnLaunchApplication2(key);
      case "semicolon": return this.OnKeySemiColon(key);
      case "colon": return this.OnKeyColon(key);
      case "equalsign": return this.OnKeyEqualSign(key);
      case "comma": return this.OnKeyComma(key);
      case "dash": return this.OnKeyDash(key);
      case "period": return this.OnKeyPeriod(key);
      case "forwardslash": return this.OnKeyForwardSlash(key);
      case "graveaccent": return this.OnKeyGraveAccent(key);
      case "openbracket": return this.OnKeyOpenBracket(key);
      case "backslash": return this.OnKeyBackSlash(key);
      case "closebraket": return this.OnKeyCloseBraket(key);
      case "singlequote": return this.OnKeySingleQuote(key);
      case "doublequote": return this.OnKeyDoubleQuote(key);
      case "backquote": return this.OnKeyBackQuote(key);
      case "backquote": return this.OnKeyBackQuote(key);
      case "openparenthesis":
      case "closeparenthesis":
      case "openbracket":
      case "closebracket":
      case "opencurlybracket":
      case "closecurlybracket":
      case "greaterthan":
      case "lessthan":
      case "percent":
      case "plus":
      case "underscore":
      case "exclamation":
      case "question":
      case "carat":
      case "hash":
      case "at":
      case "asterisk":
      case "and":
      case "tilde":
      case "minus":
      {
        return; // Ignore these for now cause I'm lazy
      }
      default:
      {
        switch (key.sequence)
        {
          case "'": return this.Remap(key, "singlequote");
          case "\"": return this.Remap(key, "doublequote");
          case "\`": return this.Remap(key, "backquote");
          case ",": return this.Remap(key, "comma");
          case ".": return this.Remap(key, "period");
          case "/": return this.Remap(key, "forwardslash");
          case "\\": return this.Remap(key, "backslash");
          case ";": return this.Remap(key, "semicolon");
          case ":": return this.Remap(key, "colon");
          case "(": return this.Remap(key, "openparenthesis");
          case ")": return this.Remap(key, "closeparenthesis");
          case "[": return this.Remap(key, "openbracket");
          case "]": return this.Remap(key, "closebracket");
          case "{": return this.Remap(key, "opencurlybracket");
          case "}": return this.Remap(key, "closecurlybracket");
          case ">": return this.Remap(key, "greaterthan");
          case "<": return this.Remap(key, "lessthan");
          case "%": return this.Remap(key, "percent");
          case "+": return this.Remap(key, "plus");
          case "_": return this.Remap(key, "underscore");
          case "!": return this.Remap(key, "exclamation");
          case "?": return this.Remap(key, "question");
          case "^": return this.Remap(key, "carat");
          case "#": return this.Remap(key, "hash");
          case "@": return this.Remap(key, "at");
          case "*": return this.Remap(key, "asterisk");
          case "&": return this.Remap(key, "and");
          case "~": return this.Remap(key, "tilde");
          case "-": return this.Remap(key, "minus");
          default: return this.OnKeyUnknown(key);
        }
      }
    }
  }

  Remap(key, name)
  {
    key.name = name;
    return this.OnKey(key.raw, key);
  }
}
