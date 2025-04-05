export const EVENTS = {
  autocomplete: StandardEvents.OnAutoComplete,
  autocompleteerror: StandardEvents.OnAutoCompleteError,
  dragexit: StandardEvents.OnDragExit,
  securitypolicyviolation: StandardEvents.OnSecurityPolicyViolation,
  sort: StandardEvents.OnSort,

  search: StandardEvents.OnSearch,
  webkitanimationend: StandardEvents.OnWebkitAnimationEnd,
  webkitanimationiteration: StandardEvents.OnWebkitAnimationIteration,
  webkitanimationstart: StandardEvents.OnWebkitAnimationStart,
  webkittransitionend: StandardEvents.OnWebkitTransitionEnd,
  cancel: StandardEvents.OnCancel,
  cuechange: StandardEvents.OnCueChange,
  invalid: StandardEvents.OnInvalid,
  mousewheel: StandardEvents.OnMouseWheel,
  toggle: StandardEvents.OnToggle,
  gotpointercapture: StandardEvents.OnGotPointerCapture,
  lostpointercapture: StandardEvents.OnLostPointerCapture,
  pointerdown: StandardEvents.OnPointerDown,
  pointermove: StandardEvents.OnPointerMove,
  pointerup: StandardEvents.OnPointerUp,
  pointercancel: StandardEvents.OnPointerCancel,
  pointerover: StandardEvents.OnPointerOver,
  pointerout: StandardEvents.OnPointerOut,
  pointerenter: StandardEvents.OnPointerEnter,
  pointerleave: StandardEvents.OnPointerLeave,
  selectstart: StandardEvents.OnSelectStart,
  selectionchange: StandardEvents.OnSelectionChange,
  hashchange: StandardEvents.OnHashChange,
  languagechange: StandardEvents.OnLanguageChange,
  messageerror: StandardEvents.OnMessageError,
  rejectionhandled: StandardEvents.OnRejectionHandled,
  storage: StandardEvents.OnStorage,
  unhandledrejection: StandardEvents.OnUnhandledRejection,
  appinstalled: StandardEvents.OnAppInstalled,
  beforeinstallprompt: StandardEvents.OnBeforeInstallPrompt,
  formdata: StandardEvents.OnFormData,

  // Resource events
  error: StandardEvents.OnLoadError,
  abort: StandardEvents.OnLoadAbort,
  load: StandardEvents.OnLoad,
  beforeunload: StandardEvents.OnBeforeUnload,
  unload: StandardEvents.OnUnload,

  // Network events
  online: StandardEvents.OnOnline,
  offline: StandardEvents.OnOffline,

  // Focus events
  input: StandardEvents.OnInput,
  focus: StandardEvents.OnFocus,
  blur: StandardEvents.OnBlur,
  change: StandardEvents.OnChange,

  // WebSocket events
  open: StandardEvents.OnSocketOpen,
  message: StandardEvents.OnSocketMessage,
  error: StandardEvents.OnSocketError,
  close: StandardEvents.OnSocketClose,

  // Session History events
  pagehide: StandardEvents.OnPageHide,
  pageshow: StandardEvents.OnPageShow,
  popstate: StandardEvents.OnPopState,

  // CSS Animation events
  animationstart: StandardEvents.OnAnimationStart,
  animationcancel: StandardEvents.OnAnimationCancel,
  animationend: StandardEvents.OnAnimationEnd,
  animationiteration: StandardEvents.OnAnimationIteration,

  // CSS Transition events
  transitionstart: StandardEvents.OnTransitionStart,
  transitioncancel: StandardEvents.OnTransitionCancel,
  transitionend: StandardEvents.OnTransitionEnd,
  transitionrun: StandardEvents.OnTransitionRun,

  // Form events
  reset: StandardEvents.OnReset,
  submit: StandardEvents.OnSubmit,

  // Printing events
  beforeprint: StandardEvents.OnBeforePrint,
  afterprint: StandardEvents.OnAfterPrint,

  // Text Composition events
  compositionstart: StandardEvents.OnCompositionStart,
  compositionupdate: StandardEvents.OnCompositionUpdate,
  compositionend: StandardEvents.OnCompositionEnd,

  // View events
  fullscreenchange: StandardEvents.OnFullscreenChange,
  fullscreenerror: StandardEvents.OnFullscreenError,
  resize: StandardEvents.OnResize,
  scroll: StandardEvents.OnScroll,

  // Clipboard events
  cut: StandardEvents.OnCut,
  copy: StandardEvents.OnCopy,
  paste: StandardEvents.OnPaste,

  // Keyboard events
  keydown: StandardEvents.OnKeyDown,
  keypress: StandardEvents.OnKeyPress,
  keyup: StandardEvents.OnKeyUp,

  // Mouse events
  auxclick: StandardEvents.OnAuxClick,
  click: StandardEvents.OnClick,
  contextmenu: StandardEvents.OnContextMenu,
  dblclick: StandardEvents.OnDblClick,
  mousedown: StandardEvents.OnMouseDown,
  mouseenter: StandardEvents.OnMouseEnter,
  mouseleave: StandardEvents.OnMouseLeave,
  mousemove: StandardEvents.OnMouseMove,
  mouseover: StandardEvents.OnMouseOver,
  mouseout: StandardEvents.OnMouseOut,
  mouseup: StandardEvents.OnMouseUp,
  pointerlockchange: StandardEvents.OnPointerLockChange,
  pointerlockerror: StandardEvents.OnPointerLockError,
  select: StandardEvents.OnSelect,
  wheel: StandardEvents.OnWheel,

  // Drag & Drop events
  drag: StandardEvents.OnDrag,
  dragend: StandardEvents.OnDragEnd,
  dragenter: StandardEvents.OnDragEnter,
  dragstart: StandardEvents.OnDragStart,
  dragleave: StandardEvents.OnDragLeave,
  dragover: StandardEvents.OnDragOver,
  drop: StandardEvents.OnDrop,

  // Media events
  audioprocess: StandardEvents.OnAudioProcess,
  canplay: StandardEvents.OnCanPlay,
  canplaythrough: StandardEvents.OnCanPlayThrough,
  complete: StandardEvents.Complete,
  durationchange: StandardEvents.OnDurationChange,
  emptied: StandardEvents.OnEmptied,
  ended: StandardEvents.OnEnded,
  loadeddata: StandardEvents.OnLoadedData,
  loadedmetadata: StandardEvents.OnLoadedMetadata,
  pause: StandardEvents.OnPause,
  play: StandardEvents.OnPlay,
  playing: StandardEvents.OnPlaying,
  ratechange: StandardEvents.OnRateChange,
  seeked: StandardEvents.OnSeeked,
  seeking: StandardEvents.OnSeeking,
  stalled: StandardEvents.OnStalled,
  suspend: StandardEvents.OnSuspend,
  timeupdate: StandardEvents.OnTimeUpdate,
  volumechange: StandardEvents.OnVolumeChange,
  waiting: StandardEvents.OnWaiting,

  // Progress events
  abort: StandardEvents.OnProgressAbort,
  error: StandardEvents.OnProgressError,
  load: StandardEvents.OnProgressLoad,
  loadend: StandardEvents.OnProgressLoadEnd,
  loadstart: StandardEvents.OnProgressLoadStart,
  progress: StandardEvents.OnProgressProgress,
  timeout: StandardEvents.OnProgressTimeout,
};

export const KEY_EVENTS = {
  8: KeyboardEvents.OnKeyBackspace,
  9: KeyboardEvents.OnKeyTab,
  13: KeyboardEvents.OnKeyEnter,
  16: KeyboardEvents.OnKeyShift,
  17: KeyboardEvents.OnKeyCtrl,
  18: KeyboardEvents.OnKeyAlt,
  19: KeyboardEvents.OnKeyPause,
  20: KeyboardEvents.OnKeyCapsLock,
  27: KeyboardEvents.OnKeyEscape,
  32: KeyboardEvents.OnKeyPageUp,
  33: KeyboardEvents.OnKeyPageUp,
  34: KeyboardEvents.OnKeyPageDown,
  35: KeyboardEvents.OnKeyEnd,
  36: KeyboardEvents.OnKeyHome,
  37: KeyboardEvents.OnKeyLeftArrow,
  38: KeyboardEvents.OnKeyUpArrow,
  39: KeyboardEvents.OnKeyRightArrow,
  40: KeyboardEvents.OnKeyDownArrow,
  45: KeyboardEvents.OnKeyInsert,
  46: KeyboardEvents.OnKeyDelete,
  48: KeyboardEvents.OnKey0,
  49: KeyboardEvents.OnKey1,
  50: KeyboardEvents.OnKey2,
  51: KeyboardEvents.OnKey3,
  52: KeyboardEvents.OnKey4,
  53: KeyboardEvents.OnKey5,
  54: KeyboardEvents.OnKey6,
  55: KeyboardEvents.OnKey7,
  56: KeyboardEvents.OnKey8,
  57: KeyboardEvents.OnKey9,
  65: KeyboardEvents.OnKeyA,
  66: KeyboardEvents.OnKeyB,
  67: KeyboardEvents.OnKeyC,
  68: KeyboardEvents.OnKeyD,
  69: KeyboardEvents.OnKeyE,
  70: KeyboardEvents.OnKeyF,
  71: KeyboardEvents.OnKeyG,
  72: KeyboardEvents.OnKeyH,
  73: KeyboardEvents.OnKeyI,
  74: KeyboardEvents.OnKeyJ,
  75: KeyboardEvents.OnKeyK,
  76: KeyboardEvents.OnKeyL,
  77: KeyboardEvents.OnKeyM,
  78: KeyboardEvents.OnKeyN,
  79: KeyboardEvents.OnKeyO,
  80: KeyboardEvents.OnKeyP,
  81: KeyboardEvents.OnKeyQ,
  82: KeyboardEvents.OnKeyR,
  83: KeyboardEvents.OnKeyS,
  84: KeyboardEvents.OnKeyT,
  85: KeyboardEvents.OnKeyU,
  86: KeyboardEvents.OnKeyV,
  87: KeyboardEvents.OnKeyW,
  88: KeyboardEvents.OnKeyX,
  89: KeyboardEvents.OnKeyY,
  90: KeyboardEvents.OnKeyZ,
  91: KeyboardEvents.OnKeyLeftWindowKey,
  92: KeyboardEvents.OnKeyRightWindowKey,
  93: KeyboardEvents.OnKeySelectKey,
  96: KeyboardEvents.OnKeyNumpad0,
  97: KeyboardEvents.OnKeyNumpad1,
  98: KeyboardEvents.OnKeyNumpad2,
  99: KeyboardEvents.OnKeyNumpad3,
  100: KeyboardEvents.OnKeyNumpad4,
  101: KeyboardEvents.OnKeyNumpad5,
  102: KeyboardEvents.OnKeyNumpad6,
  103: KeyboardEvents.OnKeyNumpad7,
  104: KeyboardEvents.OnKeyNumpad8,
  105: KeyboardEvents.OnKeyNumpad9,
  106: KeyboardEvents.OnKeyMultiply,
  107: KeyboardEvents.OnKeyAdd,
  109: KeyboardEvents.OnKeySubtract,
  110: KeyboardEvents.OnKeyDecimalPoint,
  111: KeyboardEvents.OnKeyDivide,
  112: KeyboardEvents.OnKeyF1,
  113: KeyboardEvents.OnKeyF2,
  114: KeyboardEvents.OnKeyF3,
  115: KeyboardEvents.OnKeyF4,
  116: KeyboardEvents.OnKeyF5,
  117: KeyboardEvents.OnKeyF6,
  118: KeyboardEvents.OnKeyF7,
  119: KeyboardEvents.OnKeyF8,
  120: KeyboardEvents.OnKeyF9,
  121: KeyboardEvents.OnKeyF10,
  122: KeyboardEvents.OnKeyF11,
  123: KeyboardEvents.OnKeyF12,
  144: KeyboardEvents.OnKeyNumLock,
  145: KeyboardEvents.OnKeyScrollLock,
  173: KeyboardEvents.OnAudioVolumeMute,
  174: KeyboardEvents.OnAudioVolumeDown,
  175: KeyboardEvents.OnAudioVolumeUp,
  181: KeyboardEvents.OnLaunchMediaPlayer,
  182: KeyboardEvents.OnLaunchApplication1,
  183: KeyboardEvents.OnLaunchApplication2,
  186: KeyboardEvents.OnKeySemiColon,
  187: KeyboardEvents.OnKeyEqualSign,
  188: KeyboardEvents.OnKeyComma,
  189: KeyboardEvents.OnKeyDash,
  190: KeyboardEvents.OnKeyPeriod,
  191: KeyboardEvents.OnKeyForwardSlash,
  192: KeyboardEvents.OnKeyGraveAccent,
  219: KeyboardEvents.OnKeyOpenBracket,
  220: KeyboardEvents.OnKeyBackSlash,
  221: KeyboardEvents.OnKeyCloseBraket,
  222: KeyboardEvents.OnKeySingleQuote,
};

Object.keys(EVENTS).forEach(key =>
{
  const ctor = EVENTS[key];

  switch (key)
  {
    case "resize":
    {
      window.addEventListener(key, event =>
      {
        // new StandardEvents.OnReflow(this, event).Fire().Sink();
      }, { passive: true });

      break;
    }
    case "scroll":
    {
      window.addEventListener(key, event =>
      {
        // new StandardEvents.OnReflow(this, event).Fire().Sink();
      }, { passive: true });

      break;
    }
    case "keydown":
    {
      window.addEventListener(key, event =>
      {
        const target = this.mouseover_target || event.target;

        if (target && target.tag)
        {
          // Call the general OnKeyDown event
          new StandardEvents.OnKeyDown(target.tag, event).Fire().Rise();

          // Then call the specialized version for this particular key
          const ctor = KEY_EVENTS[event.keyCode];
          if (ctor) new ctor(target.tag, event).Fire().Rise();
        }
      });

      break;
    }
    case "mouseover":
    {
      window.addEventListener(key, event =>
      {
        this.mouseover_target = event.target;

        if (event.target && event.target.tag)
        {
          new StandardEvents.OnMouseOver(event.target.tag, event).Fire().Rise();
        }
      });

      break;
    }
    default:
    {
      window.addEventListener(key, event =>
      {
        if (event.target && event.target.tag)
        {
          new ctor(event.target.tag, event).Fire().Rise();
        }
      });
    }
  }
});
