import {Keyword} from "/js/Parser/Token/CSS/Keyword.js";

export class Unit extends Keyword
{
}

export class Hertz extends Unit { Parse(p){ return p.ReadL("hz"); } }
export class KiloHertz extends Unit { Parse(p){ return p.ReadL("khz"); } }
export class Deg extends Unit { Parse(p){ return p.Read("deg"); } }
export class Grad extends Unit { Parse(p){ return p.Read("grad"); } }
export class Rad extends Unit { Parse(p){ return p.Read("rad"); } }
export class S extends Unit { Parse(p){ return p.Read("s"); } }
export class MS extends Unit { Parse(p){ return p.Read("ms"); } }
export class CM extends Unit { Parse(p){ return p.Read("cm"); } }
export class MM extends Unit { Parse(p){ return p.Read("mm"); } }
export class Q extends Unit { Parse(p){ return p.Read("q"); } }
export class IN extends Unit { Parse(p){ return p.Read("in"); } }
export class PC extends Unit { Parse(p){ return p.Read("pc"); } }
export class PT extends Unit { Parse(p){ return p.Read("pt"); } }
export class PX extends Unit { Parse(p){ return p.Read("px"); } }
export class EM extends Unit { Parse(p){ return p.Read("em"); } }
export class EX extends Unit { Parse(p){ return p.Read("ex"); } }
export class CH extends Unit { Parse(p){ return p.Read("ch"); } }
export class REM extends Unit { Parse(p){ return p.Read("rem"); } }
export class LH extends Unit { Parse(p){ return p.Read("lh"); } }
export class VW extends Unit { Parse(p){ return p.Read("vw"); } }
export class VH extends Unit { Parse(p){ return p.Read("vh"); } }
export class VMin extends Unit { Parse(p){ return p.Read("vmin"); } }
export class VMax extends Unit { Parse(p){ return p.Read("vmax"); } }
export class DPI extends Unit { Parse(p){ return p.Read("dpi"); } }
export class DPCM extends Unit { Parse(p){ return p.Read("dpcm"); } }
export class DPPX extends Unit { Parse(p){ return p.Read("dppx"); } }
export class X extends Unit { Parse(p){ return p.Read("x"); } }
