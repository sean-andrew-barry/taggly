import { OKLCH } from "/js/Utility/Color/OKLCH.js";

class Data {
  // Reserve the first 32 slots
  static DATA = Array.from({ length: 32 }, () => new Data());

  name;
  postfix;
  media;
  pseudo;
  supports;
  supported;

  static Register(...args) {
    const index = DATA.length;

    Data.DATA.push(new this(...args));

    // Return the actual bitmask
    return 1n << BigInt(index);
  }

  constructor({ name, postfix, media, supports, pseudo } = {}) {
    this.name = name;
    this.postfix = postfix;
    this.media = media;
    this.supports = supports;
    this.pseudo = pseudo;
  }

  IsSupported() { return this.supported ??= globalThis?.CSS?.supports(this.supports) ?? true; }
};

const VALUE_SHIFT = 0n, VALUE_BITS = 16n;
const VALUE_MASK  = ((1n << VALUE_BITS) - 1n) << VALUE_SHIFT;

function Register(props) {
  const index = DATA.length;

  // Create the metadata object and store it in the array
  DATA.push(new Data(props));

  // Return the actual bitmask
  return 1n << BigInt(index);
}

class Property extends Data {
  constructor(name, css) {
    super(name);
    this.css = css;
  }
};

class Media extends Data {
  constructor(name, media) {
    super(name);
    this.media = media;
  }
};

class Supported extends Data {
  constructor(name, query) {
    super(name);
    this.query = query;
  }
};

class Postfix extends Data {
  constructor(name, postfix) {
    super(name);
    this.postfix = postfix;
  }
};

class Pseudo extends Data {
  constructor(name, pseudo) {
    super(name);
    this.pseudo = pseudo;
  }
};

class Value extends Data {
  constructor(name) {
    super(name);
  }
};

class Color extends Value {
  constructor(name, l, c, h, a = 1.0) {
    super(name);
    this.color = new OKLCH(l, c, h, a);
  }
};

class Opacity extends Value {
  constructor(name, value) {
    super(name);
    this.value = value;
  }
};

class Percent extends Value {
  constructor(name, value) {
    super(name);
    this.value = value;
  }
};

class Degree extends Value {
  constructor(name, value) {
    super(name);
    this.value = value;
  }
};

class Keyword extends Value {
  constructor(name) {
    super(name);
  }
};

class Unit extends Value {
  constructor(name) {
    super(name);
  }
};

// const Color = Register;
// const Opacity = Register;
// const Property = Register;

// export const TypeInteger = Type({ type: "integer" });
// export const TypeNumber = Type({ type: "number" });
// export const TypePercent = Type({ type: "percent" });
// export const TypeColor = Type({ type: "color" });
// export const TypeOpacity = Type({ type: "opacity" });
// export const TypeEM = Type({ type: "em" });
// export const TypeREM = Type({ type: "rem" });
// export const TypeVH = Type({ type: "vh" });
// export const TypeVW = Type({ type: "vw" });

const FP = (v) => `calc(${v} * 0.25rem);`;
export const P  = Property.Register("p" , v => `padding: ${FP(v)}`);
export const PY = Property.Register("py", v => `padding-top: ${FP(v)} padding-bottom: ${FP(v)}`);
export const PX = Property.Register("px", v => `padding-left: ${FP(v)} padding-right: ${FP(v)}`);
export const PT = Property.Register("pt", v => `padding-top: ${FP(v)}`);
export const PB = Property.Register("pb", v => `padding-bottom: ${FP(v)}`);
export const PL = Property.Register("pl", v => `padding-left: ${FP(v)}`);
export const PR = Property.Register("pr", v => `padding-right: ${FP(v)}`);

const FM = (v) => `calc(${v} * 0.25rem);`;
export const M  = Property.Register("m" , v => `margin: ${FM(v)}`);
export const MY = Property.Register("my", v => `margin-top: ${FM(v)} margin-bottom: ${FM(v)}`);
export const MX = Property.Register("mx", v => `margin-left: ${FM(v)} margin-right: ${FM(v)}`);
export const MT = Property.Register("mt", v => `margin-top: ${FM(v)}`);
export const MB = Property.Register("mb", v => `margin-bottom: ${FM(v)}`);
export const ML = Property.Register("ml", v => `margin-left: ${FM(v)}`);
export const MR = Property.Register("mr", v => `margin-right: ${FM(v)}`);

export const Inset   = Property.Register("inset"  , v => `inset: ${v};`);
export const InsetX  = Property.Register("inset-x", v => `left: ${v}; right: ${v};`);
export const InsetY  = Property.Register("inset-y", v => `top: ${v}; bottom: ${v};`);
export const Top     = Property.Register("top"    , v => `top: ${v};`);
export const Right   = Property.Register("right"  , v => `right: ${v};`);
export const Bottom  = Property.Register("bottom" , v => `bottom: ${v};`);
export const Left    = Property.Register("left"   , v => `left: ${v};`);

export const Z = Property.Register("z", v => `z-index: ${v};`);

export const W      = Property.Register("w"     , v => `width: ${v};`);
export const H      = Property.Register("h"     , v => `height: ${v};`);
export const MinW   = Property.Register("min-w" , v => `min-width: ${v};`);
export const MaxW   = Property.Register("max-w" , v => `max-width: ${v};`);
export const MinH   = Property.Register("min-h" , v => `min-height: ${v};`);
export const MaxH   = Property.Register("max-h" , v => `max-height: ${v};`);
export const Size   = Property.Register("size"  , v => `width: ${v}; height: ${v};`);
export const Aspect = Property.Register("aspect", v => `aspect-ratio: ${v};`);

export const Overflow   = Property.Register("overflow"  , v => `overflow: ${v};`);
export const OverflowX  = Property.Register("overflow-x", v => `overflow-x: ${v};`);
export const OverflowY  = Property.Register("overflow-y", v => `overflow-y: ${v};`);

export const Overscroll  = Property.Register("overscroll"  , v => `overscroll-behavior: ${v};`);
export const OverscrollX = Property.Register("overscroll-x", v => `overscroll-behavior-x: ${v};`);
export const OverscrollY = Property.Register("overscroll-y", v => `overscroll-behavior-y: ${v};`);

export const ScrollM     = Property.Register("scroll-m" , v => `scroll-margin: ${v};`);
export const ScrollMX    = Property.Register("scroll-mx", v => `scroll-margin-left: ${v}; scroll-margin-right: ${v};`);
export const ScrollMY    = Property.Register("scroll-my", v => `scroll-margin-top: ${v}; scroll-margin-bottom: ${v};`);
export const ScrollMT    = Property.Register("scroll-mt", v => `scroll-margin-top: ${v};`);
export const ScrollMR    = Property.Register("scroll-mr", v => `scroll-margin-right: ${v};`);
export const ScrollMB    = Property.Register("scroll-mb", v => `scroll-margin-bottom: ${v};`);
export const ScrollML    = Property.Register("scroll-ml", v => `scroll-margin-left: ${v};`);

export const ScrollP     = Property.Register("scroll-p" , v => `scroll-padding: ${v};`);
export const ScrollPx    = Property.Register("scroll-px", v => `scroll-padding-left: ${v}; scroll-padding-right: ${v};`);
export const ScrollPy    = Property.Register("scroll-py", v => `scroll-padding-top: ${v}; scroll-padding-bottom: ${v};`);
export const ScrollPt    = Property.Register("scroll-pt", v => `scroll-padding-top: ${v};`);
export const ScrollPr    = Property.Register("scroll-pr", v => `scroll-padding-right: ${v};`);
export const ScrollPb    = Property.Register("scroll-pb", v => `scroll-padding-bottom: ${v};`);
export const ScrollPl    = Property.Register("scroll-pl", v => `scroll-padding-left: ${v};`);

export const GridCols   = Property.Register("grid-cols", v => `grid-template-columns: ${v};`);
export const GridRows   = Property.Register("grid-rows", v => `grid-template-rows: ${v};`);
export const AutoCols   = Property.Register("auto-cols", v => `grid-auto-columns: ${v};`);
export const AutoRows   = Property.Register("auto-rows", v => `grid-auto-rows: ${v};`);

export const ColSpan    = Property.Register("col-span" , v => `grid-column: span ${v} / span ${v};`);
export const ColStart   = Property.Register("col-start", v => `grid-column-start: ${v};`);
export const ColEnd     = Property.Register("col-end"  , v => `grid-column-end: ${v};`);
export const RowSpan    = Property.Register("row-span" , v => `grid-row: span ${v} / span ${v};`);
export const RowStart   = Property.Register("row-start", v => `grid-row-start: ${v};`);
export const RowEnd     = Property.Register("row-end"  , v => `grid-row-end: ${v};`);

export const Gap   = Property.Register("gap"  , v => `gap: ${v};`);
export const GapX  = Property.Register("gap-x", v => `column-gap: ${v};`);
export const GapY  = Property.Register("gap-y", v => `row-gap: ${v};`);

export const Basis  = Property.Register("basis", v => `flex-basis: ${v};`);
export const Grow   = Property.Register("grow" , v => `flex-grow: ${v};`);
export const Shrink = Property.Register("shrink", v => `flex-shrink: ${v};`);
export const Order  = Property.Register("order", v => `order: ${v};`);

export const Justify       = Property.Register("justify"      , v => `justify-content: ${v};`);
export const Items         = Property.Register("items"        , v => `align-items: ${v};`);
export const Content       = Property.Register("content"      , v => `align-content: ${v};`);
export const PlaceContent  = Property.Register("place-content", v => `place-content: ${v};`);
export const PlaceItems    = Property.Register("place-items"  , v => `place-items: ${v};`);

export const JustifyItems  = Property.Register("justify-items", v => `justify-items: ${v};`);
export const JustifySelf   = Property.Register("justify-self" , v => `justify-self: ${v};`);
export const Self          = Property.Register("self"         , v => `align-self: ${v};`);
export const PlaceSelf     = Property.Register("place-self"   , v => `place-self: ${v};`);

export const Bg          = Property.Register("bg"         , v => `background: ${v};`);
export const BgOpacity   = Property.Register("bg-opacity" , v => `--tw-bg-opacity: ${v};`); // if you use opacity vars
export const BgClip      = Property.Register("bg-clip"    , v => `background-clip: ${v};`);
export const BgOrigin    = Property.Register("bg-origin"  , v => `background-origin: ${v};`);
export const BgRepeat    = Property.Register("bg-repeat"  , v => `background-repeat: ${v};`);
export const BgSize      = Property.Register("bg-size"    , v => `background-size: ${v};`);
export const BgPosition  = Property.Register("bg-position", v => `background-position: ${v};`);
export const BgAttachment= Property.Register("bg-attachment", v => `background-attachment: ${v};`);
export const BgBlend     = Property.Register("bg-blend"   , v => `background-blend-mode: ${v};`);

export const ObjectFit     = Property.Register("object"       , v => `object-fit: ${v};`);
export const ObjectPosition= Property.Register("object-position", v => `object-position: ${v};`);

export const Rounded     = Property.Register("rounded"   , v => `border-radius: ${v};`);
export const RoundedT    = Property.Register("rounded-t" , v => `border-top-left-radius: ${v}; border-top-right-radius: ${v};`);
export const RoundedR    = Property.Register("rounded-r" , v => `border-top-right-radius: ${v}; border-bottom-right-radius: ${v};`);
export const RoundedB    = Property.Register("rounded-b" , v => `border-bottom-right-radius: ${v}; border-bottom-left-radius: ${v};`);
export const RoundedL    = Property.Register("rounded-l" , v => `border-top-left-radius: ${v}; border-bottom-left-radius: ${v};`);
export const RoundedTl   = Property.Register("rounded-tl", v => `border-top-left-radius: ${v};`);
export const RoundedTr   = Property.Register("rounded-tr", v => `border-top-right-radius: ${v};`);
export const RoundedBr   = Property.Register("rounded-br", v => `border-bottom-right-radius: ${v};`);
export const RoundedBl   = Property.Register("rounded-bl", v => `border-bottom-left-radius: ${v};`);

export const BorderStyle = Property.Register("border-style", v => `border-style: ${v};`);
export const Border      = Property.Register("border"      , v => `border-width: ${v};`);
export const BorderX     = Property.Register("border-x"    , v => `border-left-width: ${v}; border-right-width: ${v};`);
export const BorderY     = Property.Register("border-y"    , v => `border-top-width: ${v}; border-bottom-width: ${v};`);
export const BorderT     = Property.Register("border-t"    , v => `border-top-width: ${v};`);
export const BorderR     = Property.Register("border-r"    , v => `border-right-width: ${v};`);
export const BorderB     = Property.Register("border-b"    , v => `border-bottom-width: ${v};`);
export const BorderL     = Property.Register("border-l"    , v => `border-left-width: ${v};`);

export const BorderColor = Property.Register("border-color", v => `border-color: ${v};`);

export const Outline        = Property.Register("outline"       , v => `outline: ${v};`);
export const OutlineOffset  = Property.Register("outline-offset", v => `outline-offset: ${v};`);

export const Shadow      = Property.Register("shadow"     , v => `box-shadow: ${v};`);
export const Opacity     = Property.Register("opacity"    , v => `opacity: ${v};`);
export const MixBlend    = Property.Register("mix-blend"  , v => `mix-blend-mode: ${v};`);
export const Isolation   = Property.Register("isolation"  , v => `isolation: ${v};`);

export const Filter      = Property.Register("filter"     , v => `filter: ${v};`);
export const Blur        = Property.Register("blur"       , v => `filter: blur(${v});`);
export const Brightness  = Property.Register("brightness" , v => `filter: brightness(${v});`);
export const Contrast    = Property.Register("contrast"   , v => `filter: contrast(${v});`);
export const DropShadow  = Property.Register("drop-shadow", v => `filter: drop-shadow(${v});`);
export const Grayscale   = Property.Register("grayscale"  , v => `filter: grayscale(${v});`);
export const HueRotate   = Property.Register("hue-rotate" , v => `filter: hue-rotate(${v});`);
export const Invert      = Property.Register("invert"     , v => `filter: invert(${v});`);
export const Saturate    = Property.Register("saturate"   , v => `filter: saturate(${v});`);
export const Sepia       = Property.Register("sepia"      , v => `filter: sepia(${v});`);

export const BackdropFilter     = Property.Register("backdrop-filter"    , v => `backdrop-filter: ${v};`);
export const BackdropBlur       = Property.Register("backdrop-blur"      , v => `backdrop-filter: blur(${v});`);
export const BackdropBrightness = Property.Register("backdrop-brightness", v => `backdrop-filter: brightness(${v});`);
export const BackdropContrast   = Property.Register("backdrop-contrast"  , v => `backdrop-filter: contrast(${v});`);
export const BackdropGrayscale  = Property.Register("backdrop-grayscale" , v => `backdrop-filter: grayscale(${v});`);
export const BackdropHueRotate  = Property.Register("backdrop-hue-rotate", v => `backdrop-filter: hue-rotate(${v});`);
export const BackdropInvert     = Property.Register("backdrop-invert"    , v => `backdrop-filter: invert(${v});`);
export const BackdropOpacity    = Property.Register("backdrop-opacity"   , v => `--tw-backdrop-opacity: ${v};`);
export const BackdropSaturate   = Property.Register("backdrop-saturate"  , v => `backdrop-filter: saturate(${v});`);
export const BackdropSepia      = Property.Register("backdrop-sepia"     , v => `backdrop-filter: sepia(${v});`);

export const Scale    = Property.Register("scale"   , v => `transform: scale(${v});`);
export const ScaleX   = Property.Register("scale-x" , v => `transform: scaleX(${v});`);
export const ScaleY   = Property.Register("scale-y" , v => `transform: scaleY(${v});`);
export const Rotate   = Property.Register("rotate"  , v => `transform: rotate(${v});`);
export const TranslateX = Property.Register("translate-x", v => `transform: translateX(${v});`);
export const TranslateY = Property.Register("translate-y", v => `transform: translateY(${v});`);
export const SkewX    = Property.Register("skew-x"  , v => `transform: skewX(${v});`);
export const SkewY    = Property.Register("skew-y"  , v => `transform: skewY(${v});`);
export const TransformOrigin = Property.Register("origin", v => `transform-origin: ${v};`);

export const TransitionProperty = Property.Register("transition", v => `transition-property: ${v};`);
export const Duration           = Property.Register("duration"  , v => `transition-duration: ${v};`);
export const Delay              = Property.Register("delay"     , v => `transition-delay: ${v};`);
export const Ease               = Property.Register("ease"      , v => `transition-timing-function: ${v};`);
export const Animate            = Property.Register("animate"   , v => `animation: ${v};`);

export const Fill    = Property.Register("fill"       , v => `fill: ${v};`);
export const Stroke  = Property.Register("stroke"     , v => `stroke: ${v};`);
export const StrokeW = Property.Register("stroke-w", v => `stroke-width: ${v};`);

export const Accent         = Property.Register("accent"        , v => `accent-color: ${v};`);
export const Appearance     = Property.Register("appearance"    , v => `appearance: ${v};`);
export const Caret          = Property.Register("caret"         , v => `caret-color: ${v};`);
export const Cursor         = Property.Register("cursor"        , v => `cursor: ${v};`);
export const PointerEvents  = Property.Register("pointer-events", v => `pointer-events: ${v};`);
export const Resize         = Property.Register("resize"        , v => `resize: ${v};`);
export const ScrollBehavior = Property.Register("scroll"        , v => `scroll-behavior: ${v};`);
export const Touch          = Property.Register("touch"         , v => `touch-action: ${v};`);
export const Select         = Property.Register("select"        , v => `user-select: ${v};`);
export const WillChange     = Property.Register("will-change"   , v => `will-change: ${v};`);

export const BreakBefore = Property.Register("break-before", v => `break-before: ${v};`);
export const BreakInside = Property.Register("break-inside", v => `break-inside: ${v};`);
export const BreakAfter  = Property.Register("break-after" , v => `break-after: ${v};`);

export const Columns = Property.Register("columns", v => `columns: ${v};`);

export const ListStyleType  = Property.Register("list", v => `list-style-type: ${v};`);
export const ListStylePos   = Property.Register("list-position", v => `list-style-position: ${v};`);
export const TableLayout    = Property.Register("table", v => `table-layout: ${v};`);

export const Red50  = Color.Register("red-50" , 0.971, 0.013, 17.38);
export const Red100 = Color.Register("red-100", 0.936, 0.032, 17.717);
export const Red200 = Color.Register("red-200", 0.885, 0.062, 18.334);
export const Red300 = Color.Register("red-300", 0.808, 0.114, 19.571);
export const Red400 = Color.Register("red-400", 0.704, 0.191, 22.216);
export const Red500 = Color.Register("red-500", 0.637, 0.237, 25.331);
export const Red600 = Color.Register("red-600", 0.577, 0.245, 27.325);
export const Red700 = Color.Register("red-700", 0.505, 0.213, 27.518);
export const Red800 = Color.Register("red-800", 0.444, 0.177, 26.899);
export const Red900 = Color.Register("red-900", 0.396, 0.141, 25.723);
export const Red950 = Color.Register("red-950", 0.258, 0.092, 26.042);
export const Orange50  = Color.Register("orange-50" , 0.98, 0.016, 73.684);
export const Orange100 = Color.Register("orange-100", 0.954, 0.038, 75.164);
export const Orange200 = Color.Register("orange-200", 0.901, 0.076, 70.697);
export const Orange300 = Color.Register("orange-300", 0.837, 0.128, 66.29);
export const Orange400 = Color.Register("orange-400", 0.75, 0.183, 55.934);
export const Orange500 = Color.Register("orange-500", 0.705, 0.213, 47.604);
export const Orange600 = Color.Register("orange-600", 0.646, 0.222, 41.116);
export const Orange700 = Color.Register("orange-700", 0.553, 0.195, 38.402);
export const Orange800 = Color.Register("orange-800", 0.47, 0.157, 37.304);
export const Orange900 = Color.Register("orange-900", 0.408, 0.123, 38.172);
export const Orange950 = Color.Register("orange-950", 0.266, 0.079, 36.259);
export const Amber50  = Color.Register("amber-50" , 0.987, 0.022, 95.277);
export const Amber100 = Color.Register("amber-100", 0.962, 0.059, 95.617);
export const Amber200 = Color.Register("amber-200", 0.924, 0.12, 95.746);
export const Amber300 = Color.Register("amber-300", 0.879, 0.169, 91.605);
export const Amber400 = Color.Register("amber-400", 0.828, 0.189, 84.429);
export const Amber500 = Color.Register("amber-500", 0.769, 0.188, 70.08);
export const Amber600 = Color.Register("amber-600", 0.666, 0.179, 58.318);
export const Amber700 = Color.Register("amber-700", 0.555, 0.163, 48.998);
export const Amber800 = Color.Register("amber-800", 0.473, 0.137, 46.201);
export const Amber900 = Color.Register("amber-900", 0.414, 0.112, 45.904);
export const Amber950 = Color.Register("amber-950", 0.279, 0.077, 45.635);
export const Yellow50  = Color.Register("yellow-50" , 0.987, 0.026, 102.212);
export const Yellow100 = Color.Register("yellow-100", 0.973, 0.071, 103.193);
export const Yellow200 = Color.Register("yellow-200", 0.945, 0.129, 101.54);
export const Yellow300 = Color.Register("yellow-300", 0.905, 0.182, 98.111);
export const Yellow400 = Color.Register("yellow-400", 0.852, 0.199, 91.936);
export const Yellow500 = Color.Register("yellow-500", 0.795, 0.184, 86.047);
export const Yellow600 = Color.Register("yellow-600", 0.681, 0.162, 75.834);
export const Yellow700 = Color.Register("yellow-700", 0.554, 0.135, 66.442);
export const Yellow800 = Color.Register("yellow-800", 0.476, 0.114, 61.907);
export const Yellow900 = Color.Register("yellow-900", 0.421, 0.095, 57.708);
export const Yellow950 = Color.Register("yellow-950", 0.286, 0.066, 53.813);
export const Lime50  = Color.Register("lime-50" , 0.986, 0.031, 120.757);
export const Lime100 = Color.Register("lime-100", 0.967, 0.067, 122.328);
export const Lime200 = Color.Register("lime-200", 0.938, 0.127, 124.321);
export const Lime300 = Color.Register("lime-300", 0.897, 0.196, 126.665);
export const Lime400 = Color.Register("lime-400", 0.841, 0.238, 128.85);
export const Lime500 = Color.Register("lime-500", 0.768, 0.233, 130.85);
export const Lime600 = Color.Register("lime-600", 0.648, 0.2, 131.684);
export const Lime700 = Color.Register("lime-700", 0.532, 0.157, 131.589);
export const Lime800 = Color.Register("lime-800", 0.453, 0.124, 130.933);
export const Lime900 = Color.Register("lime-900", 0.405, 0.101, 131.063);
export const Lime950 = Color.Register("lime-950", 0.274, 0.072, 132.109);
export const Green50  = Color.Register("green-50" , 0.982, 0.018, 155.826);
export const Green100 = Color.Register("green-100", 0.962, 0.044, 156.743);
export const Green200 = Color.Register("green-200", 0.925, 0.084, 155.995);
export const Green300 = Color.Register("green-300", 0.871, 0.15, 154.449);
export const Green400 = Color.Register("green-400", 0.792, 0.209, 151.711);
export const Green500 = Color.Register("green-500", 0.723, 0.219, 149.579);
export const Green600 = Color.Register("green-600", 0.627, 0.194, 149.214);
export const Green700 = Color.Register("green-700", 0.527, 0.154, 150.069);
export const Green800 = Color.Register("green-800", 0.448, 0.119, 151.328);
export const Green900 = Color.Register("green-900", 0.393, 0.095, 152.535);
export const Green950 = Color.Register("green-950", 0.266, 0.065, 152.934);
export const Emerald50  = Color.Register("emerald-50" , 0.979, 0.021, 166.113);
export const Emerald100 = Color.Register("emerald-100", 0.95, 0.052, 163.051);
export const Emerald200 = Color.Register("emerald-200", 0.905, 0.093, 164.15);
export const Emerald300 = Color.Register("emerald-300", 0.845, 0.143, 164.978);
export const Emerald400 = Color.Register("emerald-400", 0.765, 0.177, 163.223);
export const Emerald500 = Color.Register("emerald-500", 0.696, 0.17, 162.48);
export const Emerald600 = Color.Register("emerald-600", 0.596, 0.145, 163.225);
export const Emerald700 = Color.Register("emerald-700", 0.508, 0.118, 165.612);
export const Emerald800 = Color.Register("emerald-800", 0.432, 0.095, 166.913);
export const Emerald900 = Color.Register("emerald-900", 0.378, 0.077, 168.94);
export const Emerald950 = Color.Register("emerald-950", 0.262, 0.051, 172.552);
export const Teal50  = Color.Register("teal-50" , 0.984, 0.014, 180.72);
export const Teal100 = Color.Register("teal-100", 0.953, 0.051, 180.801);
export const Teal200 = Color.Register("teal-200", 0.91, 0.096, 180.426);
export const Teal300 = Color.Register("teal-300", 0.855, 0.138, 181.071);
export const Teal400 = Color.Register("teal-400", 0.777, 0.152, 181.912);
export const Teal500 = Color.Register("teal-500", 0.704, 0.14, 182.503);
export const Teal600 = Color.Register("teal-600", 0.6, 0.118, 184.704);
export const Teal700 = Color.Register("teal-700", 0.511, 0.096, 186.391);
export const Teal800 = Color.Register("teal-800", 0.437, 0.078, 188.216);
export const Teal900 = Color.Register("teal-900", 0.386, 0.063, 188.416);
export const Teal950 = Color.Register("teal-950", 0.277, 0.046, 192.524);
export const Cyan50  = Color.Register("cyan-50" , 0.984, 0.019, 200.873);
export const Cyan100 = Color.Register("cyan-100", 0.956, 0.045, 203.388);
export const Cyan200 = Color.Register("cyan-200", 0.917, 0.08, 205.041);
export const Cyan300 = Color.Register("cyan-300", 0.865, 0.127, 207.078);
export const Cyan400 = Color.Register("cyan-400", 0.789, 0.154, 211.53);
export const Cyan500 = Color.Register("cyan-500", 0.715, 0.143, 215.221);
export const Cyan600 = Color.Register("cyan-600", 0.609, 0.126, 221.723);
export const Cyan700 = Color.Register("cyan-700", 0.52, 0.105, 223.128);
export const Cyan800 = Color.Register("cyan-800", 0.45, 0.085, 224.283);
export const Cyan900 = Color.Register("cyan-900", 0.398, 0.07, 227.392);
export const Cyan950 = Color.Register("cyan-950", 0.302, 0.056, 229.695);
export const Sky50  = Color.Register("sky-50" , 0.977, 0.013, 236.62);
export const Sky100 = Color.Register("sky-100", 0.951, 0.026, 236.824);
export const Sky200 = Color.Register("sky-200", 0.901, 0.058, 230.902);
export const Sky300 = Color.Register("sky-300", 0.828, 0.111, 230.318);
export const Sky400 = Color.Register("sky-400", 0.746, 0.16, 232.661);
export const Sky500 = Color.Register("sky-500", 0.685, 0.169, 237.323);
export const Sky600 = Color.Register("sky-600", 0.588, 0.158, 241.966);
export const Sky700 = Color.Register("sky-700", 0.5, 0.134, 242.749);
export const Sky800 = Color.Register("sky-800", 0.443, 0.11, 240.79);
export const Sky900 = Color.Register("sky-900", 0.391, 0.09, 240.876);
export const Sky950 = Color.Register("sky-950", 0.293, 0.066, 243.157);
export const Blue50  = Color.Register("blue-50" , 0.97, 0.014, 254.604);
export const Blue100 = Color.Register("blue-100", 0.932, 0.032, 255.585);
export const Blue200 = Color.Register("blue-200", 0.882, 0.059, 254.128);
export const Blue300 = Color.Register("blue-300", 0.809, 0.105, 251.813);
export const Blue400 = Color.Register("blue-400", 0.707, 0.165, 254.624);
export const Blue500 = Color.Register("blue-500", 0.623, 0.214, 259.815);
export const Blue600 = Color.Register("blue-600", 0.546, 0.245, 262.881);
export const Blue700 = Color.Register("blue-700", 0.488, 0.243, 264.376);
export const Blue800 = Color.Register("blue-800", 0.424, 0.199, 265.638);
export const Blue900 = Color.Register("blue-900", 0.379, 0.146, 265.522);
export const Blue950 = Color.Register("blue-950", 0.282, 0.091, 267.935);
export const Indigo50  = Color.Register("indigo-50" , 0.962, 0.018, 272.314);
export const Indigo100 = Color.Register("indigo-100", 0.93, 0.034, 272.788);
export const Indigo200 = Color.Register("indigo-200", 0.87, 0.065, 274.039);
export const Indigo300 = Color.Register("indigo-300", 0.785, 0.115, 274.713);
export const Indigo400 = Color.Register("indigo-400", 0.673, 0.182, 276.935);
export const Indigo500 = Color.Register("indigo-500", 0.585, 0.233, 277.117);
export const Indigo600 = Color.Register("indigo-600", 0.511, 0.262, 276.966);
export const Indigo700 = Color.Register("indigo-700", 0.457, 0.24, 277.023);
export const Indigo800 = Color.Register("indigo-800", 0.398, 0.195, 277.366);
export const Indigo900 = Color.Register("indigo-900", 0.359, 0.144, 278.697);
export const Indigo950 = Color.Register("indigo-950", 0.257, 0.09, 281.288);
export const Violet50  = Color.Register("violet-50" , 0.969, 0.016, 293.756);
export const Violet100 = Color.Register("violet-100", 0.943, 0.029, 294.588);
export const Violet200 = Color.Register("violet-200", 0.894, 0.057, 293.283);
export const Violet300 = Color.Register("violet-300", 0.811, 0.111, 293.571);
export const Violet400 = Color.Register("violet-400", 0.702, 0.183, 293.541);
export const Violet500 = Color.Register("violet-500", 0.606, 0.25, 292.717);
export const Violet600 = Color.Register("violet-600", 0.541, 0.281, 293.009);
export const Violet700 = Color.Register("violet-700", 0.491, 0.27, 292.581);
export const Violet800 = Color.Register("violet-800", 0.432, 0.232, 292.759);
export const Violet900 = Color.Register("violet-900", 0.38, 0.189, 293.745);
export const Violet950 = Color.Register("violet-950", 0.283, 0.141, 291.089);
export const Purple50  = Color.Register("purple-50" , 0.977, 0.014, 308.299);
export const Purple100 = Color.Register("purple-100", 0.946, 0.033, 307.174);
export const Purple200 = Color.Register("purple-200", 0.902, 0.063, 306.703);
export const Purple300 = Color.Register("purple-300", 0.827, 0.119, 306.383);
export const Purple400 = Color.Register("purple-400", 0.714, 0.203, 305.504);
export const Purple500 = Color.Register("purple-500", 0.627, 0.265, 303.9);
export const Purple600 = Color.Register("purple-600", 0.558, 0.288, 302.321);
export const Purple700 = Color.Register("purple-700", 0.496, 0.265, 301.924);
export const Purple800 = Color.Register("purple-800", 0.438, 0.218, 303.724);
export const Purple900 = Color.Register("purple-900", 0.381, 0.176, 304.987);
export const Purple950 = Color.Register("purple-950", 0.291, 0.149, 302.717);
export const Fuchsia50 = Color.Register("fuchsia-50", 0.977, 0.017, 320.058);
export const Fuchsia100 = Color.Register("fuchsia-100", 0.952, 0.037, 318.852);
export const Fuchsia200 = Color.Register("fuchsia-200", 0.903, 0.076, 319.62);
export const Fuchsia300 = Color.Register("fuchsia-300", 0.833, 0.145, 321.434);
export const Fuchsia400 = Color.Register("fuchsia-400", 0.74, 0.238, 322.16);
export const Fuchsia500 = Color.Register("fuchsia-500", 0.667, 0.295, 322.15);
export const Fuchsia600 = Color.Register("fuchsia-600", 0.591, 0.293, 322.896);
export const Fuchsia700 = Color.Register("fuchsia-700", 0.518, 0.253, 323.949);
export const Fuchsia800 = Color.Register("fuchsia-800", 0.452, 0.211, 324.591);
export const Fuchsia900 = Color.Register("fuchsia-900", 0.401, 0.17, 325.612);
export const Fuchsia950 = Color.Register("fuchsia-950", 0.293, 0.136, 325.661);
export const Pink50  = Color.Register("pink-50" , 0.971, 0.014, 343.198);
export const Pink100 = Color.Register("pink-100", 0.948, 0.028, 342.258);
export const Pink200 = Color.Register("pink-200", 0.899, 0.061, 343.231);
export const Pink300 = Color.Register("pink-300", 0.823, 0.12, 346.018);
export const Pink400 = Color.Register("pink-400", 0.718, 0.202, 349.761);
export const Pink500 = Color.Register("pink-500", 0.656, 0.241, 354.308);
export const Pink600 = Color.Register("pink-600", 0.592, 0.249, 0.584);
export const Pink700 = Color.Register("pink-700", 0.525, 0.223, 3.958);
export const Pink800 = Color.Register("pink-800", 0.459, 0.187, 3.815);
export const Pink900 = Color.Register("pink-900", 0.408, 0.153, 2.432);
export const Pink950 = Color.Register("pink-950", 0.284, 0.109, 3.907);
export const Rose50  = Color.Register("rose-50" , 0.969, 0.015, 12.422);
export const Rose100 = Color.Register("rose-100", 0.941, 0.03, 12.58);
export const Rose200 = Color.Register("rose-200", 0.892, 0.058, 10.001);
export const Rose300 = Color.Register("rose-300", 0.81, 0.117, 11.638);
export const Rose400 = Color.Register("rose-400", 0.712, 0.194, 13.428);
export const Rose500 = Color.Register("rose-500", 0.645, 0.246, 16.439);
export const Rose600 = Color.Register("rose-600", 0.586, 0.253, 17.585);
export const Rose700 = Color.Register("rose-700", 0.514, 0.222, 16.935);
export const Rose800 = Color.Register("rose-800", 0.455, 0.188, 13.697);
export const Rose900 = Color.Register("rose-900", 0.41, 0.159, 10.272);
export const Rose950 = Color.Register("rose-950", 0.271, 0.105, 12.094);
export const Slate50  = Color.Register("slate-50" , 0.984, 0.003, 247.858);
export const Slate100 = Color.Register("slate-100", 0.968, 0.007, 247.896);
export const Slate200 = Color.Register("slate-200", 0.929, 0.013, 255.508);
export const Slate300 = Color.Register("slate-300", 0.869, 0.022, 252.894);
export const Slate400 = Color.Register("slate-400", 0.704, 0.04, 256.788);
export const Slate500 = Color.Register("slate-500", 0.554, 0.046, 257.417);
export const Slate600 = Color.Register("slate-600", 0.446, 0.043, 257.281);
export const Slate700 = Color.Register("slate-700", 0.372, 0.044, 257.287);
export const Slate800 = Color.Register("slate-800", 0.279, 0.041, 260.031);
export const Slate900 = Color.Register("slate-900", 0.208, 0.042, 265.755);
export const Slate950 = Color.Register("slate-950", 0.129, 0.042, 264.695);
export const Gray50  = Color.Register("gray-50" , 0.985, 0.002, 247.839);
export const Gray100 = Color.Register("gray-100", 0.967, 0.003, 264.542);
export const Gray200 = Color.Register("gray-200", 0.928, 0.006, 264.531);
export const Gray300 = Color.Register("gray-300", 0.872, 0.01, 258.338);
export const Gray400 = Color.Register("gray-400", 0.707, 0.022, 261.325);
export const Gray500 = Color.Register("gray-500", 0.551, 0.027, 264.364);
export const Gray600 = Color.Register("gray-600", 0.446, 0.03, 256.802);
export const Gray700 = Color.Register("gray-700", 0.373, 0.034, 259.733);
export const Gray800 = Color.Register("gray-800", 0.278, 0.033, 256.848);
export const Gray900 = Color.Register("gray-900", 0.21, 0.034, 264.665);
export const Gray950 = Color.Register("gray-950", 0.13, 0.028, 261.692);
export const Zinc50  = Color.Register("zinc-50" , 0.985, 0, 0);
export const Zinc100 = Color.Register("zinc-100", 0.967, 0.001, 286.375);
export const Zinc200 = Color.Register("zinc-200", 0.92, 0.004, 286.32);
export const Zinc300 = Color.Register("zinc-300", 0.871, 0.006, 286.286);
export const Zinc400 = Color.Register("zinc-400", 0.705, 0.015, 286.067);
export const Zinc500 = Color.Register("zinc-500", 0.552, 0.016, 285.938);
export const Zinc600 = Color.Register("zinc-600", 0.442, 0.017, 285.786);
export const Zinc700 = Color.Register("zinc-700", 0.37, 0.013, 285.805);
export const Zinc800 = Color.Register("zinc-800", 0.274, 0.006, 286.033);
export const Zinc900 = Color.Register("zinc-900", 0.21, 0.006, 285.885);
export const Zinc950 = Color.Register("zinc-950", 0.141, 0.005, 285.823);
export const Neutral50  = Color.Register("neutral-50" , 0.985, 0, 0);
export const Neutral100 = Color.Register("neutral-100", 0.97, 0, 0);
export const Neutral200 = Color.Register("neutral-200", 0.922, 0, 0);
export const Neutral300 = Color.Register("neutral-300", 0.87, 0, 0);
export const Neutral400 = Color.Register("neutral-400", 0.708, 0, 0);
export const Neutral500 = Color.Register("neutral-500", 0.556, 0, 0);
export const Neutral600 = Color.Register("neutral-600", 0.439, 0, 0);
export const Neutral700 = Color.Register("neutral-700", 0.371, 0, 0);
export const Neutral800 = Color.Register("neutral-800", 0.269, 0, 0);
export const Neutral900 = Color.Register("neutral-900", 0.205, 0, 0);
export const Neutral950 = Color.Register("neutral-950", 0.145, 0, 0);
export const Stone50  = Color.Register("stone-50" , 0.985, 0.001, 106.423);
export const Stone100 = Color.Register("stone-100", 0.97, 0.001, 106.424);
export const Stone200 = Color.Register("stone-200", 0.923, 0.003, 48.717);
export const Stone300 = Color.Register("stone-300", 0.869, 0.005, 56.366);
export const Stone400 = Color.Register("stone-400", 0.709, 0.01, 56.259);
export const Stone500 = Color.Register("stone-500", 0.553, 0.013, 58.071);
export const Stone600 = Color.Register("stone-600", 0.444, 0.011, 73.639);
export const Stone700 = Color.Register("stone-700", 0.374, 0.01, 67.558);
export const Stone800 = Color.Register("stone-800", 0.268, 0.007, 34.298);
export const Stone900 = Color.Register("stone-900", 0.216, 0.006, 56.043);
export const Stone950 = Color.Register("stone-950", 0.147, 0.004, 49.25);
export const Black = Color.Register("black", 0, 0, 0);
export const White = Color.Register("white", 1, 0, 0);
export const Transparent = Color.Register("transparent", 1, 0, 0, 0);

// export const Red = Color("red");
// export const Orange = Color("orange");
// export const Amber = Color("amber");
// export const Yellow = Color("yellow");
// export const Lime = Color("lime");
// export const Green = Color("green");
// export const Emerald = Color("emerald");
// export const Teal = Color("teal");
// export const Cyan = Color("cyan");
// export const Sky = Color("sky");
// export const Blue = Color("blue");
// export const Indigo = Color("indigo");
// export const Violet = Color("violet");
// export const Purple = Color("purple");
// export const Fuchsia = Color("fuchsia");
// export const Pink = Color("pink");
// export const Rose = Color("rose");
// export const Slate = Color("slate");
// export const Gray = Color("gray");
// export const Zinc = Color("zinc");
// export const Neutral = Color("neutral");
// export const Stone = Color("stone");

// export const C0   = ColorValue("0");
// export const C50  = ColorValue("50");
// export const C100 = ColorValue("100");
// export const C200 = ColorValue("200");
// export const C300 = ColorValue("300");
// export const C400 = ColorValue("400");
// export const C500 = ColorValue("500");
// export const C600 = ColorValue("600");
// export const C700 = ColorValue("700");
// export const C800 = ColorValue("800");
// export const C900 = ColorValue("900");
// export const C950 = ColorValue("950");
// export const C1000 = ColorValue("1000");

export const FromRed = From.Register("from-red");
export const FromGreen = From.Register("from-green");
export const FromBlue = From.Register("from-blue");
export const FromCyan = From.Register("from-cyan");
export const FromMagenta = From.Register("from-magenta");
export const FromYellow = From.Register("from-yellow");
export const FromLight = From.Register("from-light");
export const FromDark = From.Register("from-dark");
export const FromSaturated = From.Register("from-saturated");
export const FromDesaturated = From.Register("from-desaturated");

export const ViaRed = Via.Register("via-red");
export const ViaGreen = Via.Register("via-green");
export const ViaBlue = Via.Register("via-blue");
export const ViaCyan = Via.Register("via-cyan");
export const ViaMagenta = Via.Register("via-magenta");
export const ViaYellow = Via.Register("via-yellow");
export const ViaLight = Via.Register("via-light");
export const ViaDark = Via.Register("via-dark");
export const ViaSaturated = Via.Register("via-saturated");
export const ViaDesaturated = Via.Register("via-desaturated");

export const ToRed = To.Register("to-red");
export const ToGreen = To.Register("to-green");
export const ToBlue = To.Register("to-blue");
export const ToCyan = To.Register("to-cyan");
export const ToMagenta = To.Register("to-magenta");
export const ToYellow = To.Register("to-yellow");
export const ToLight = To.Register("to-light");
export const ToDark = To.Register("to-dark");
export const ToSaturated = To.Register("to-saturated");
export const ToDesaturated = To.Register("to-desaturated");

export const Opacity0   = Opacity.Register("opacity-0"  , 0.00);
export const Opacity5   = Opacity.Register("opacity-5"  , 0.05);
export const Opacity10  = Opacity.Register("opacity-10" , 0.10);
export const Opacity15  = Opacity.Register("opacity-15" , 0.15);
export const Opacity20  = Opacity.Register("opacity-20" , 0.20);
export const Opacity25  = Opacity.Register("opacity-25" , 0.25);
export const Opacity30  = Opacity.Register("opacity-30" , 0.30);
export const Opacity35  = Opacity.Register("opacity-35" , 0.35);
export const Opacity40  = Opacity.Register("opacity-40" , 0.40);
export const Opacity45  = Opacity.Register("opacity-45" , 0.45);
export const Opacity50  = Opacity.Register("opacity-50" , 0.50);
export const Opacity60  = Opacity.Register("opacity-60" , 0.60);
export const Opacity65  = Opacity.Register("opacity-65" , 0.65);
export const Opacity70  = Opacity.Register("opacity-70" , 0.70);
export const Opacity75  = Opacity.Register("opacity-75" , 0.75);
export const Opacity80  = Opacity.Register("opacity-80" , 0.80);
export const Opacity85  = Opacity.Register("opacity-85" , 0.85);
export const Opacity90  = Opacity.Register("opacity-90" , 0.90);
export const Opacity95  = Opacity.Register("opacity-95" , 0.95);
export const Opacity100 = Opacity.Register("opacity-100", 1.00);

export const Percent0   = Percent.Register("percent-0"  , 0.00);
export const Percent5   = Percent.Register("percent-5"  , 0.05);
export const Percent10  = Percent.Register("percent-10" , 0.10);
export const Percent15  = Percent.Register("percent-15" , 0.15);
export const Percent20  = Percent.Register("percent-20" , 0.20);
export const Percent25  = Percent.Register("percent-25" , 0.25);
export const Percent30  = Percent.Register("percent-30" , 0.30);
export const Percent35  = Percent.Register("percent-35" , 0.35);
export const Percent40  = Percent.Register("percent-40" , 0.40);
export const Percent45  = Percent.Register("percent-45" , 0.45);
export const Percent50  = Percent.Register("percent-50" , 0.50);
export const Percent60  = Percent.Register("percent-60" , 0.60);
export const Percent65  = Percent.Register("percent-65" , 0.65);
export const Percent70  = Percent.Register("percent-70" , 0.70);
export const Percent75  = Percent.Register("percent-75" , 0.75);
export const Percent80  = Percent.Register("percent-80" , 0.80);
export const Percent85  = Percent.Register("percent-85" , 0.85);
export const Percent90  = Percent.Register("percent-90" , 0.90);
export const Percent95  = Percent.Register("percent-95" , 0.95);
export const Percent100 = Percent.Register("percent-100", 1.00);

export const Degree0 = Degree.Register("degree-0", 0);
export const Degree45 = Degree.Register("degree-45", 45);
export const Degree90 = Degree.Register("degree-90", 90);
export const Degree180 = Degree.Register("degree-180", 180);
export const Degree360 = Degree.Register("degree-360", 360);

export const Dark         = Media.Register("dark",          "(prefers-color-scheme: dark)");
export const Print        = Media.Register("print",         "print");
export const MotionSafe   = Media.Register("motion-safe",   "(prefers-reduced-motion: no-preference)");
export const MotionReduce = Media.Register("motion-reduce", "(prefers-reduced-motion: reduce)");
export const ContrastMore = Media.Register("contrast-more", "(prefers-contrast: more)");
export const ContrastLess = Media.Register("contrast-less", "(prefers-contrast: less)");
export const ForcedColors = Media.Register("forced-colors", "(forced-colors: active)");

export const PointerFine      = Media.Register("pointer-fine",       "(pointer: fine)");
export const PointerCoarse    = Media.Register("pointer-coarse",     "(pointer: coarse)");
export const PointerNone      = Media.Register("pointer-none",       "(pointer: none)");

export const AnyPointerFine   = Media.Register("any-pointer-fine",   "(any-pointer: fine)");
export const AnyPointerCoarse = Media.Register("any-pointer-coarse", "(any-pointer: coarse)");
export const AnyPointerNone   = Media.Register("any-pointer-none",   "(any-pointer: none)");

export const SM  = Media.Register("sm",  "(min-width: 40rem)");
export const MD  = Media.Register("md",  "(min-width: 48rem)");
export const LG  = Media.Register("lg",  "(min-width: 64rem)");
export const XL  = Media.Register("xl",  "(min-width: 80rem)");
export const XL2 = Media.Register("2xl", "(min-width: 96rem)");

export const MaxSM  = Media.Register("max-sm",  "(max-width: 40rem)");
export const MaxMD  = Media.Register("max-md",  "(max-width: 48rem)");
export const MaxLG  = Media.Register("max-lg",  "(max-width: 64rem)");
export const MaxXL  = Media.Register("max-xl",  "(max-width: 80rem)");
export const MaxXL2 = Media.Register("max-2xl", "(max-width: 96rem)");

export const GroupHover           = Group("group-hover",         );
export const GroupFocus           = Group("group-focus",         );
export const GroupFocusWithin     = Group("group-focus-within",  );
export const GroupFocusVisible    = Group("group-focus-visible", );
export const GroupActive          = Group("group-active",        );
export const GroupDisabled        = Group("group-disabled",      );
export const GroupChecked         = Group("group-checked",       );
export const GroupOpen            = Group("group-open",          );

export const PeerHover            = Peer("peer-hover",         );
export const PeerFocus            = Peer("peer-focus",         );
export const PeerFocusWithin      = Peer("peer-focus-within",  );
export const PeerFocusVisible     = Peer("peer-focus-visible", );
export const PeerActive           = Peer("peer-active",        );
export const PeerDisabled         = Peer("peer-disabled",      );
export const PeerChecked          = Peer("peer-checked",       );
export const PeerInvalid          = Peer("peer-invalid",       );
export const PeerRequired         = Peer("peer-required",      );
export const PeerOpen             = Peer("peer-open",          );

export const InHover              = Register({ name: "in-hover",            });
export const InFocus              = Register({ name: "in-focus",            });
export const InFocusWithin        = Register({ name: "in-focus-within",     });
export const InFocusVisible       = Register({ name: "in-focus-visible",    });
export const InActive             = Register({ name: "in-active",           });
export const InDisabled           = Register({ name: "in-disabled",         });
export const InChecked            = Register({ name: "in-checked",          });
export const InOpen               = Register({ name: "in-open",             });

export const AriaBusy     = Aria("aria-busy",     );
export const AriaChecked  = Aria("aria-checked",  );
export const AriaDisabled = Aria("aria-disabled", );
export const AriaExpanded = Aria("aria-expanded", );
export const AriaHidden   = Aria("aria-hidden",   );
export const AriaPressed  = Aria("aria-pressed",  );
export const AriaReadonly = Aria("aria-readonly", );
export const AriaRequired = Aria("aria-required", );
export const AriaSelected = Aria("aria-selected", );

export const DataOpen        = Register({ name: "data-open",         });
export const DataClosed      = Register({ name: "data-closed",       });
export const DataCurrent     = Register({ name: "data-current",      });
export const DataStateOpen   = Register({ name: "data-state-open",   });
export const DataStateClosed = Register({ name: "data-state-closed", });
export const DataStateActive = Register({ name: "data-state-active", });

export const SupportsGrid              = Register({ name: "supports-grid",                supports: "(display: grid)" });
export const SupportsBackdropFilter    = Register({ name: "supports-backdrop-filter",     supports: "(backdrop-filter: blur(0))" });
export const NotSupportsBackdropFilter = Register({ name: "not-supports-backdrop-filter", supports: "not (backdrop-filter: blur(0))" });

export const Hover        = Postfix("hover",         ":hover");
export const Focus        = Postfix("focus",         ":focus");
export const FocusWithin  = Postfix("focus-within",  ":focus-within");
export const FocusVisible = Postfix("focus-visible", ":focus-visible");
export const Active       = Postfix("active",        ":active");
export const Visited      = Postfix("visited",       ":visited");
export const Target       = Postfix("target",        ":target");

export const First       = Postfix("first",         ":first-child");
export const Last        = Postfix("last",          ":last-child");
export const Only        = Postfix("only",          ":only-child");
export const Odd         = Postfix("odd",           ":nth-child(odd)");
export const Even        = Postfix("even",          ":nth-child(even)");
export const FirstOfType = Postfix("first-of-type", ":first-of-type");
export const LastOfType  = Postfix("last-of-type",  ":last-of-type");
export const Empty       = Postfix("empty",         ":empty");

export const Disabled         = Postfix("disabled",          ":disabled");
export const Enabled          = Postfix("enabled",           ":enabled");
export const Checked          = Postfix("checked",           ":checked");
export const Indeterminate    = Postfix("indeterminate",     ":indeterminate");
export const Default          = Postfix("default",           ":default");
export const Required         = Postfix("required",          ":required");
export const Optional         = Postfix("optional",          ":optional");
export const ReadOnly         = Postfix("read-only",         ":read-only");
export const ReadWrite        = Postfix("read-write",        ":read-write");
export const PlaceholderShown = Postfix("placeholder-shown", ":placeholder-shown");
export const Autofill         = Postfix("autofill",          ":autofill");
export const InRange          = Postfix("in-range",          ":in-range");
export const OutOfRange       = Postfix("out-of-range",      ":out-of-range");
export const Valid            = Postfix("valid",             ":valid");
export const Invalid          = Postfix("invalid",           ":invalid");
export const UserInvalid      = Postfix("user-invalid",      ":user-invalid");
export const Open             = Postfix("open",              ":open");

export const NotHover        = Postfix("not-hover",         ":not(:hover)");
export const NotFocus        = Postfix("not-focus",         ":not(:focus)");
export const NotFocusWithin  = Postfix("not-focus-within",  ":not(:focus-within)");
export const NotFocusVisible = Postfix("not-focus-visible", ":not(:focus-visible)");
export const NotActive       = Postfix("not-active",        ":not(:active)");
export const NotVisited      = Postfix("not-visited",       ":not(:visited)");
export const NotTarget       = Postfix("not-target",        ":not(:target)");

export const NotFirst       = Postfix("not-first",         ":not(:first-child)");
export const NotLast        = Postfix("not-last",          ":not(:last-child)");
export const NotOnly        = Postfix("not-only",          ":not(:only-child)");
export const NotOdd         = Postfix("not-odd",           ":not(:nth-child(odd))");
export const NotEven        = Postfix("not-even",          ":not(:nth-child(even))");
export const NotFirstOfType = Postfix("not-first-of-type", ":not(:first-of-type)");
export const NotLastOfType  = Postfix("not-last-of-type",  ":not(:last-of-type)");
export const NotEmpty       = Postfix("not-empty",         ":not(:empty)");

export const NotDisabled         = Postfix("not-disabled",          ":not(:disabled)");
export const NotEnabled          = Postfix("not-enabled",           ":not(:enabled)");
export const NotChecked          = Postfix("not-checked",           ":not(:checked)");
export const NotIndeterminate    = Postfix("not-indeterminate",     ":not(:indeterminate)");
export const NotDefault          = Postfix("not-default",           ":not(:default)");
export const NotRequired         = Postfix("not-required",          ":not(:required)");
export const NotOptional         = Postfix("not-optional",          ":not(:optional)");
export const NotReadOnly         = Postfix("not-read-only",         ":not(:read-only)");
export const NotReadWrite        = Postfix("not-read-write",        ":not(:read-write)");
export const NotPlaceholderShown = Postfix("not-placeholder-shown", ":not(:placeholder-shown)");
export const NotAutofill         = Postfix("not-autofill",          ":not(:autofill)");
export const NotInRange          = Postfix("not-in-range",          ":not(:in-range)");
export const NotOutOfRange       = Postfix("not-out-of-range",      ":not(:out-of-range)");
export const NotValid            = Postfix("not-valid",             ":not(:valid)");
export const NotInvalid          = Postfix("not-invalid",           ":not(:invalid)");
export const NotUserInvalid      = Postfix("not-user-invalid",      ":not(:user-invalid)");
export const NotOpen             = Postfix("not-open",              ":not(:open)");

export const Before      = Pseudo("before",       "::before");
export const After       = Pseudo("after",        "::after");
export const Placeholder = Pseudo("placeholder",  "::placeholder");
export const File        = Pseudo("file",         "::file-selector-button");
export const Marker      = Pseudo("marker",       "::marker");
export const Selection   = Pseudo("selection",    "::selection");
export const FirstLine   = Pseudo("first-line",   "::first-line");
export const FirstLetter = Pseudo("first-letter", "::first-letter");
export const Backdrop    = Pseudo("backdrop",     "::backdrop");

export const EM = Register({ name: "em", unit: "em" });
export const REM = Register({ name: "rem", unit: "rem" });
export const VW = Register({ name: "vw", unit: "vw" });
export const VH = Register({ name: "vh", unit: "vh" });

export const Inline = Keyword.Register("inline");
export const Block = Keyword.Register("block");
export const InlineBlock = Keyword.Register("inline-block");
export const Flex = Keyword.Register("flex");
export const InlineFlex = Keyword.Register("inline-flex");
export const Grid = Keyword.Register("grid");
export const InlineGrid = Keyword.Register("inline-grid");
export const None = Keyword.Register("none");
export const Contents = Keyword.Register("contents");
export const Table = Keyword.Register("table");
export const TableRow = Keyword.Register("table-row");
export const ListItem = Keyword.Register("list-item");
export const FlowRoot = Keyword.Register("flow-root");
export const Unset = Keyword.Register("unset");
export const Revert = Keyword.Register("revert");
export const Inherit = Keyword.Register("inherit");
export const Right = Keyword.Register("right");
export const Left = Keyword.Register("left");
export const Start = Keyword.Register("start");
export const End = Keyword.Register("end");
export const Center = Keyword.Register("center");
export const Between = Keyword.Register("between");
export const Around = Keyword.Register("around");
export const Evenly = Keyword.Register("evenly");
export const Stretch = Keyword.Register("stretch");
export const Baseline = Keyword.Register("baseline");
export const Normal = Keyword.Register("normal");
export const None = Keyword.Register("none");
export const Auto = Keyword.Register("auto");
export const Both = Keyword.Register("both");
export const Row = Keyword.Register("row");
export const Column = Keyword.Register("column");
export const Reverse = Keyword.Register("reverse");
export const Wrap = Keyword.Register("wrap");
export const NoWrap = Keyword.Register("no-wrap");
export const Initial = Keyword.Register("initial");
export const First = Keyword.Register("first");
export const Last = Keyword.Register("last");
export const Fixed = Keyword.Register("fixed");
export const Local = Keyword.Register("local");
export const Scroll = Keyword.Register("scroll");

const SELECTORS = new Set();
const CACHE = new Map();
const ATTR = CSS.supports("(x: attr(x type(*)))"); // Test if level 5 `attr` support is available

export class Flags {
  #value;
  #attribute;
  #selector;
  #postfix;
  #media;
  #supported;

  constructor(flags) {
    const flag = CACHE.get(flags);
    if (flag) return flag;

    if (flags < 0n) {
      throw new Error("Negative immediate not allowed. Use the Negative flag.");
    }

    let attribute = "";
    let selector = "";
    let postfix = "";
    let media = "";
    let pseudo = "";
    let supported = true;

    let base = 0; // The bit index of current 32-bit word
    let x = flags;
    let value = Number(x & 0xFFFF_FFFFn) >>> 0;
    x >>= 32n;
    base += 32;

    while (x !== 0n) {
      const word = Number(x & 0xFFFF_FFFFn) >>> 0;

      if (word) {
        let t = word;

        while (t) {
          const low = t & -t; // Isolate the lowest set bit

          const data = DATA[base + 31 - Math.clz32(low)];

          if (data.name) {
            attribute += (attribute ? ":"   : "") + data.name;
            selector  += (selector  ? "\\:" : "") + data.name;
          }

          if (data.postfix) postfix += data.postfix;
          if (data.media)   media   += (media ? " and " : "") + data.media;
          if (data.pseudo)  pseudo  =  data.pseudo; // Only one pseudo-element is allowed
          if (data.supported === false) supported = false; // If any are unsupported, it all is

          t &= t - 1; // Clear the lowest set bit
        }
      }

      // Advance to the next word
      x >>= 32n;
      base += 32;
    }

    this.#value = value;
    this.#attribute = attribute;
    this.#selector = selector;
    this.#postfix = postfix + pseudo;
    this.#media = media;
    this.#supported = supported;

    CACHE.set(flags, this);
  }

  #Attr(value) {
    switch (typeof value) {
      case "string": return `attr(${value} string)`;
      case "number": return `attr(${value} number)`;
    }
  }

  Format(name, value, properties) {
    let selector;
    let attribute;

    if (ATTR) {
      selector = `[data-${this.#selector}]${this.#postfix} { ${properties(this.#Attr(value))} }`;
    } else {
      // We need to include the value in the selector
      selector = `[data-${this.#selector}="${value}"]${this.#postfix} { ${properties(`${value}`)} }`;
    }
  }

  GetAttribute() { return this.#attribute; }
  GetSelector() { return this.#selector; }
  GetPostfix() { return this.#postfix; }
  GetMedia() { return this.#media; }
  IsSupported() { return this.#supported; }
};