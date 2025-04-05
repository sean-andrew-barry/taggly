import {Keyword} from "/js/Token/CSS/Keyword.js";

export class LTRKeyword extends Keyword { Value(){ return "ltr"; } }
export class RTLKeyword extends Keyword { Value(){ return "rtl"; } }
export class NKeyword extends Keyword { Value(){ return "n"; } }
export class EvenKeyword extends Keyword { Value(){ return "even"; } }
export class OddKeyword extends Keyword { Value(){ return "odd"; } }
// export class ForKeyword extends Keyword { Value(){ return "for"; } }
export class OfKeyword extends Keyword { Value(){ return "of"; } }

// TODO: Case sensitivity
export class IKeyword extends Keyword { Value(){ return "i"; } }
export class SKeyword extends Keyword { Value(){ return "s"; } }

// Pseudo elements
export class AfterKeyword extends Keyword { Value(){ return "after"; } }
export class BackdropKeyword extends Keyword { Value(){ return "backdrop"; } }
export class BeforeKeyword extends Keyword { Value(){ return "before"; } }
export class CueKeyword extends Keyword { Value(){ return "cue"; } }
export class CueRegionKeyword extends Keyword { Value(){ return "cue-region"; } }
export class FirstLetterKeyword extends Keyword { Value(){ return "first-letter"; } }
export class FirstLineKeyword extends Keyword { Value(){ return "first-line"; } }
export class FileSelectorButtonKeyword extends Keyword { Value(){ return "file-selector-button"; } }
export class GrammarErrorKeyword extends Keyword { Value(){ return "grammar-error"; } }
export class HighlightKeyword extends Keyword { Value(){ return "highlight"; } }
export class MarkerKeyword extends Keyword { Value(){ return "marker"; } }
export class PartKeyword extends Keyword { Value(){ return "part"; } }
export class PlaceholderKeyword extends Keyword { Value(){ return "placeholder"; } }
export class SelectionKeyword extends Keyword { Value(){ return "selection"; } }
export class SlottedKeyword extends Keyword { Value(){ return "slotted"; } }
export class SpellingErrorKeyword extends Keyword { Value(){ return "spelling-error"; } }
export class TargetTextKeyword extends Keyword { Value(){ return "target-text"; } }

// Pseudo classes
export class ActiveKeyword extends Keyword { Value(){ return "active"; } }
export class AnyLinkKeyword extends Keyword { Value(){ return "any-link"; } }
export class AutofillKeyword extends Keyword { Value(){ return "autofill"; } }
export class BlankKeyword extends Keyword { Value(){ return "blank"; } }
export class CheckedKeyword extends Keyword { Value(){ return "checked"; } }
export class CurrentKeyword extends Keyword { Value(){ return "current"; } }
export class DefaultKeyword extends Keyword { Value(){ return "default"; } }
export class DefinedKeyword extends Keyword { Value(){ return "defined"; } }
export class DirKeyword extends Keyword { Value(){ return "dir"; } }
export class DisabledKeyword extends Keyword { Value(){ return "disabled"; } }
export class EmptyKeyword extends Keyword { Value(){ return "empty"; } }
export class EnabledKeyword extends Keyword { Value(){ return "enabled"; } }
export class FirstKeyword extends Keyword { Value(){ return "first"; } }
export class FirstChildKeyword extends Keyword { Value(){ return "first-child"; } }
export class FirstOfTypeKeyword extends Keyword { Value(){ return "first-of-type"; } }
export class FullscreenKeyword extends Keyword { Value(){ return "fullscreen"; } }
export class FutureKeyword extends Keyword { Value(){ return "future"; } }
export class FocusKeyword extends Keyword { Value(){ return "focus"; } }
export class FocusVisibleKeyword extends Keyword { Value(){ return "focus-visible"; } }
export class FocusWithinKeyword extends Keyword { Value(){ return "focus-within"; } }
export class HasKeyword extends Keyword { Value(){ return "has"; } }
export class HostKeyword extends Keyword { Value(){ return "host"; } }
export class HostContextKeyword extends Keyword { Value(){ return "host-context"; } }
export class HoverKeyword extends Keyword { Value(){ return "hover"; } }
export class IndeterminateKeyword extends Keyword { Value(){ return "indeterminate"; } }
export class InRangeKeyword extends Keyword { Value(){ return "in-range"; } }
export class InvalidKeyword extends Keyword { Value(){ return "invalid"; } }
export class IsKeyword extends Keyword { Value(){ return "is"; } }
export class LangKeyword extends Keyword { Value(){ return "lang"; } }
export class LastChildKeyword extends Keyword { Value(){ return "last-child"; } }
export class LastOfTypeKeyword extends Keyword { Value(){ return "last-of-type"; } }
export class LeftKeyword extends Keyword { Value(){ return "left"; } }
export class LinkKeyword extends Keyword { Value(){ return "link"; } }
export class LocalLinkKeyword extends Keyword { Value(){ return "local-link"; } }
export class ModalKeyword extends Keyword { Value(){ return "modal"; } }
export class NotKeyword extends Keyword { Value(){ return "not"; } }
export class NthChildKeyword extends Keyword { Value(){ return "nth-child"; } }
export class NthColKeyword extends Keyword { Value(){ return "nth-col"; } }
export class NthLastChildKeyword extends Keyword { Value(){ return "nth-last-child"; } }
export class NthLastColKeyword extends Keyword { Value(){ return "nth-last-col"; } }
export class NthLastOfTypeKeyword extends Keyword { Value(){ return "nth-last-of-type"; } }
export class NthOfTypeKeyword extends Keyword { Value(){ return "nth-of-type"; } }
export class OnlyChildKeyword extends Keyword { Value(){ return "only-child"; } }
export class OnlyOfTypeKeyword extends Keyword { Value(){ return "only-of-type"; } }
export class OptionalKeyword extends Keyword { Value(){ return "optional"; } }
export class OutOfRangeKeyword extends Keyword { Value(){ return "out-of-range"; } }
export class PastKeyword extends Keyword { Value(){ return "past"; } }
export class PictureInPictureKeyword extends Keyword { Value(){ return "picture-in-picture"; } }
export class PlaceholderShownKeyword extends Keyword { Value(){ return "placeholder-shown"; } }
export class PausedKeyword extends Keyword { Value(){ return "paused"; } }
export class PlayingKeyword extends Keyword { Value(){ return "playing"; } }
export class ReadOnlyKeyword extends Keyword { Value(){ return "read-only"; } }
export class ReadWriteKeyword extends Keyword { Value(){ return "read-write"; } }
export class RequiredKeyword extends Keyword { Value(){ return "required"; } }
export class RightKeyword extends Keyword { Value(){ return "right"; } }
export class RootKeyword extends Keyword { Value(){ return "root"; } }
export class ScopeKeyword extends Keyword { Value(){ return "scope"; } }
export class StateKeyword extends Keyword { Value(){ return "state"; } }
export class TargetKeyword extends Keyword { Value(){ return "target"; } }
export class TargetWithinKeyword extends Keyword { Value(){ return "target-within"; } }
export class UserInvalidKeyword extends Keyword { Value(){ return "user-invalid"; } }
export class ValidKeyword extends Keyword { Value(){ return "valid"; } }
export class VisitedKeyword extends Keyword { Value(){ return "visited"; } }
export class WhereKeyword extends Keyword { Value(){ return "where"; } }