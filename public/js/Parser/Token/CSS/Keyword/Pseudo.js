import {Keyword} from "/js/Parser/Token/CSS/Keyword.js";

export class Pseudo extends Keyword
{
}

export class After extends Pseudo { Parse(p){ return p.Read("::after") || p.Read(":after"); } }
export class Backdrop extends Pseudo { Parse(p){ return p.Read("::backdrop"); } }
export class Before extends Pseudo { Parse(p){ return p.Read("::before") || p.Read(":before"); } }
export class Cue extends Pseudo { Parse(p){ return p.Read("::cue"); } }
export class CueRegion extends Pseudo { Parse(p){ return p.Read("::cue-region"); } }
export class FirstLetter extends Pseudo { Parse(p){ return p.Read("::first-letter") || p.Read(":first-letter"); } }
export class FirstLine extends Pseudo { Parse(p){ return p.Read("::first-line") || p.Read(":first-line"); } }
export class FileSelectorButton extends Pseudo { Parse(p){ return p.Read("::file-selector-button"); } }
export class GrammarError extends Pseudo { Parse(p){ return p.Read("::grammar-error"); } }
export class Marker extends Pseudo { Parse(p){ return p.Read("::marker"); } }
export class Part extends Pseudo { Parse(p){ return p.Read("::part()"); } }
export class Placeholder extends Pseudo { Parse(p){ return p.Read("::placeholder"); } }
export class selection extends Pseudo { Parse(p){ return p.Read("::selection"); } }
export class Slotted extends Pseudo { Parse(p){ return p.Read("::slotted()"); } }
export class SpellingError extends Pseudo { Parse(p){ return p.Read("::spelling-error"); } }
export class TargetText extends Pseudo { Parse(p){ return p.Read("::target-text"); } }
export class Hover extends Pseudo { Parse(p){ return p.Read(":hover"); } }
export class Visited extends Pseudo { Parse(p){ return p.Read(":visited"); } }
