import {Attributes} from "/js/Tag/Attributes.js";
import Freeze from "/js/Utility/Freeze.js";
import window from "/js/Window.js";

export class Styles extends Attributes
{
  // // Helpers
  // TimeCSS(a){ return a; }
  // SizeCSS(a){ return a; }
  // CubicBezierCSS(a, b = "end"){ return `steps(${a}, ${b})`; }
  // CubicBezierCSS(a, b, c, d){ return `cubic-bezier(${a}, ${b}, ${c}, ${d})`; }
  //
  // WhiteCSS(){ return; }
  // BlackCSS(){ return; }
  // LightCSS(){ return; }
  // DarkCSS(){ return; }
  // PrimaryCSS(){ return; }
  // SecondaryCSS(){ return; }
  // InfoCSS(){ return; }
  // LinkCSS(){ return; }
  // SuccessCSS(){ return; }
  // WarningCSS(){ return; }
  // DangerCSS(){ return; }
  // GreyCSS(){ return; }
  // RedCSS(){ return; }
  // OrangeCSS(){ return; }
  // YellowCSS(){ return; }
  // GreenCSS(){ return; }
  // TealCSS(){ return; }
  // BlueCSS(){ return; }
  // IndigoCSS(){ return; }
  // PurpleCSS(){ return; }
  // PinkCSS(){ return; }
  //
  // Apply(action, args)
  // {
  //   switch (action)
  //   {
  //     case "animation": return this.Animation.apply(this, args);
  //     case "appearance": return this.AppearanceDefault.apply(this, args);
  //     case "-webkit-appearance": return this.AppearanceWebkit.apply(this, args);
  //     case "-moz-appearance": return this.AppearanceMoz.apply(this, args);
  //     case "color": return this.Color.apply(this, args);
  //     case "align-items": return this.AlignItems.apply(this, args);
  //     case "align-self": return this.AlignSelf.apply(this, args);
  //     case "place-self": return this.PlaceSelf.apply(this, args);
  //     case "align-content": return this.AlignContent.apply(this, args);
  //     case "justify-content": return this.JustifyContent.apply(this, args);
  //     case "place-content": return this.PlaceContent.apply(this, args);
  //     case "justify-items": return this.JustifyItems.apply(this, args);
  //     case "place-items": return this.PlaceItems.apply(this, args);
  //     case "justify-self": return this.JustifySelf.apply(this, args);
  //     case "background": return this.Background.apply(this, args);
  //     case "background-attachment": return this.BackgroundAttachment.apply(this, args);
  //     case "background-image": return this.BackgroundClip.apply(this, args);
  //     case "background-color": return this.BackgroundColor.apply(this, args);
  //     case "background-image": return this.BackgroundImage.apply(this, args);
  //     case "background-position": return this.BackgroundPosition.apply(this, args);
  //     case "background-repeat": return this.BackgroundRepeat.apply(this, args);
  //     case "background-origin": return this.BackgroundOrigin.apply(this, args);
  //     case "background-size": return this.BackgroundSize.apply(this, args);
  //     case "box-shadow": return this.BackgroundShadow.apply(this, args);
  //     case "box-sizing": return this.BoxSizing.apply(this, args);
  //     case "box-shadow": return this.BoxShadow.apply(this, args);
  //     case "border": return this.Border.apply(this, args);
  //     case "border-width": return this.BorderWidth.apply(this, args);
  //     case "border-style": return this.BorderStyle.apply(this, args);
  //     case "border-color": return this.BorderColor.apply(this, args);
  //     case "border-image": return this.BorderImage.apply(this, args);
  //     case "border-radius": return this.BorderRadius.apply(this, args);
  //     case "border-top-left-radius": return this.BorderTopLeftRadius.apply(this, args);
  //     case "border-top-right-radius": return this.BorderTopRightRadius.apply(this, args);
  //     case "border-bottom-left-radius": return this.BorderBottomLeftRadius.apply(this, args);
  //     case "border-bottom-right-radius": return this.BorderBottomRightRadius.apply(this, args);
  //     case "border-width": return this.BorderWidth.apply(this, args);
  //     case "border-left-width": return this.BorderLeftWidth.apply(this, args);
  //     case "border-right-width": return this.BorderRightWidth.apply(this, args);
  //     case "border-top-width": return this.BorderTopWidth.apply(this, args);
  //     case "border-bottom-width": return this.BorderBottomWidth.apply(this, args);
  //     case "border-left": return this.BorderLeft.apply(this, args);
  //     case "border-right": return this.BorderRight.apply(this, args);
  //     case "border-top": return this.BorderTop.apply(this, args);
  //     case "border-bottom": return this.BorderBottom.apply(this, args);
  //     case "border-bottom-style": return this.BorderBottomStyle.apply(this, args);
  //     case "border-bottom-color": return this.BorderBottomColor.apply(this, args);
  //     case "border-top-style": return this.BorderTopStyle.apply(this, args);
  //     case "border-top-color": return this.BorderTopColor.apply(this, args);
  //     case "border-right-style": return this.BorderRightStyle.apply(this, args);
  //     case "border-right-color": return this.BorderRightColor.apply(this, args);
  //     case "border-left-style": return this.BorderLeftStyle.apply(this, args);
  //     case "border-left-color": return this.BorderLeftColor.apply(this, args);
  //     case "cursor": return this.Cursor.apply(this, args);
  //     case "display": return this.Display.apply(this, args);
  //     case "flex": return this.Flex.apply(this, args);
  //     case "flex-basis": return this.FlexBasis.apply(this, args);
  //     case "flex-direction": return this.FlexDirection.apply(this, args);
  //     case "flex-flow": return this.FlexFlow.apply(this, args);
  //     case "flex-grow": return this.FlexGrow.apply(this, args);
  //     case "flex-shrink": return this.FlexShrink.apply(this, args);
  //     case "flex-wrap": return this.FlexWrap.apply(this, args);
  //     case "float": return this.Float.apply(this, args);
  //     case "grid": return this.Grid.apply(this, args);
  //     case "grid-area": return this.GridArea.apply(this, args);
  //     case "grid-auto-columns": return this.GridAutoColumns.apply(this, args);
  //     case "grid-auto-flow": return this.GridAutoFlow.apply(this, args);
  //     case "grid-auto-rows": return this.GridAutoRows.apply(this, args);
  //     case "grid-column": return this.GridColumn.apply(this, args);
  //     case "grid-column-start": return this.GridColumnStart.apply(this, args);
  //     case "grid-column-end": return this.GridColumnEnd.apply(this, args);
  //     case "grid-row": return this.GridRow.apply(this, args);
  //     case "grid-row-start": return this.GridRowStart.apply(this, args);
  //     case "grid-row-end": return this.GridRowEnd.apply(this, args);
  //     case "grid-template": return this.GridTemplate.apply(this, args);
  //     case "grid-template-columns": return this.GridTemplateColumns.apply(this, args);
  //     case "grid-template-rows": return this.GridTemplateRows.apply(this, args);
  //     case "grid-template-areas": return this.GridTemplateAreas.apply(this, args);
  //     case "image-orientation": return this.ImageOrientation.apply(this, args);
  //     case "image-rendering": return this.ImageRendering.apply(this, args);
  //     case "margin": return this.Margin.apply(this, args);
  //     case "margin-left": return this.MarginLeft.apply(this, args);
  //     case "margin-right": return this.MarginRight.apply(this, args);
  //     case "margin-top": return this.MarginTop.apply(this, args);
  //     case "margin-bottom": return this.MarginBottom.apply(this, args);
  //     case "width": return this.Width.apply(this, args);
  //     case "height": return this.Height.apply(this, args);
  //     case "max-width": return this.MaxWidth.apply(this, args);
  //     case "max-height": return this.MaxHeight.apply(this, args);
  //     case "min-width": return this.MinWidth.apply(this, args);
  //     case "min-height": return this.MinHeight.apply(this, args);
  //     case "top": return this.Top.apply(this, args);
  //     case "bottom": return this.Bottom.apply(this, args);
  //     case "left": return this.Left.apply(this, args);
  //     case "right": return this.Right.apply(this, args);
  //     case "fill": return this.Fill.apply(this, args);
  //     case "stroke": return this.Stroke.apply(this, args);
  //     case "stroke-width": return this.StrokeWidth.apply(this, args);
  //     case "order": return this.Order.apply(this, args);
  //     case "outline": return this.Outline.apply(this, args);
  //     case "outline-color": return this.OutlineColor.apply(this, args);
  //     case "outline-offset": return this.OutlineOffset.apply(this, args);
  //     case "outline-style": return this.OutlineStyle.apply(this, args);
  //     case "outline-width": return this.OutlineWidth.apply(this, args);
  //     case "overflow": return this.Overflow.apply(this, args);
  //     case "overflow-wrap": return this.OverflowWrap.apply(this, args);
  //     case "overflow-x": return this.OverflowX.apply(this, args);
  //     case "overflow-y": return this.OverflowY.apply(this, args);
  //     case "opacity": return this.Opacity.apply(this, args);
  //     case "object-fit": return this.ObjectFit.apply(this, args);
  //     case "padding": return this.Padding.apply(this, args);
  //     case "padding-left": return this.PaddingLeft.apply(this, args);
  //     case "padding-right": return this.PaddingRight.apply(this, args);
  //     case "padding-top": return this.PaddingTop.apply(this, args);
  //     case "padding-bottom": return this.PaddingBottom.apply(this, args);
  //     case "position": return this.Position.apply(this, args);
  //     case "pointer-events": return this.PointerEvents.apply(this, args);
  //     case "tab-size": return this.TabSize.apply(this, args);
  //     case "table-layout": return this.TableLayout.apply(this, args);
  //     case "text-size-adjust": return this.TextSizeAdjust.apply(this, args);
  //     case "font-family": return this.FontFamily.apply(this, args);
  //     case "font-weight": return this.FontWeight.apply(this, args);
  //     case "font-variant-ligatures": return this.FontVariantLigatures.apply(this, args);
  //     case "font-variant-caps": return this.FontVariantCaps.apply(this, args);
  //     case "font-variant-numeric": return this.FontVariantNumeric.apply(this, args);
  //     case "font-variant-east-asian": return this.FontVariantEastAsian.apply(this, args);
  //     case "font-stretch": return this.FontStretch.apply(this, args);
  //     case "vertical-align": return this.VerticalAlign.apply(this, args);
  //     case "-webkit-appearance": return this.WebkitAppearance.apply(this, args);
  //     case "user-select": return this.UserSelect.apply(this, args);
  //     case "border-image-source": return this.BorderImageSource.apply(this, args);
  //     case "border-image-slice": return this.BorderImageSlice.apply(this, args);
  //     case "border-image-outset": return this.BorderImageOutset.apply(this, args);
  //     case "border-image-width": return this.BorderImageWidth.apply(this, args);
  //     case "border-image-repeat": return this.BorderImageRepeat.apply(this, args);
  //     case "animation-duration": return this.AnimationDuration.apply(this, args);
  //     case "animation-timing-function": return this.AnimationTimingFunction.apply(this, args);
  //     case "animation-delay": return this.AnimationDelay.apply(this, args);
  //     case "animation-iteration-count": return this.AnimationIterationCount.apply(this, args);
  //     case "animation-direction": return this.AnimationDirection.apply(this, args);
  //     case "animation-fill-mode": return this.AnimationFillMode.apply(this, args);
  //     case "animation-play-state": return this.AnimationPlayState.apply(this, args);
  //     case "animation-name": return this.AnimationName.apply(this, args);
  //     case "list-style-property": return this.ListStyleProperty.apply(this, args);
  //     case "list-style-position": return this.ListStylePosition.apply(this, args);
  //     case "list-style-image": return this.ListStyleImage.apply(this, args);
  //     case "list-style-type": return this.ListStyleType.apply(this, args);
  //     case "border-collapse": return this.BorderCollapse.apply(this, args);
  //     case "-webkit-border-horizontal-spacing": return this.WebkitBorderHorizontalSpacing.apply(this, args);
  //     case "-webkit-border-vertical-spacing": return this.WebkitBorderVerticalSpacing.apply(this, args);
  //     case "-webkit-font-smoothing": return this.WebkitFontSmoothing.apply(this, args);
  //     case "clip": return this.Clip.apply(this, args);
  //     case "--columnGap": return this.ColumnGap.apply(this, args);
  //     case "column-gap": return this.ColumnGap.apply(this, args);
  //     case "background-position-x": return this.BackgroundPositionX.apply(this, args);
  //     case "background-position-y": return this.BackgroundPositionY.apply(this, args);
  //     case "background-repeat-x": return this.BackgroundRepeatX.apply(this, args);
  //     case "background-repeat-y": return this.BackgroundRepeatY.apply(this, args);
  //     case "transition": return this.Transition.apply(this, args);
  //     case "transition-delay": return this.TransitionDelay.apply(this, args);
  //     case "transition-duration": return this.TransitionDuration.apply(this, args);
  //     case "transition-property": return this.TransitionProperty.apply(this, args);
  //     case "transition-timing-function": return this.TransitionTimingFunction.apply(this, args);
  //     case "transform": return this.Transform.apply(this, args);
  //     case "transform-origin": return this.TransformOrigin.apply(this, args);
  //     case "transform-origin-left": return this.TransformOriginLeft.apply(this, args);
  //     case "transform-origin-right": return this.TransformOriginRight.apply(this, args);
  //     case "translate": return this.Translate.apply(this, args);
  //     case "turn": return this.Turn.apply(this, args);
  //     case "rotate": return this.Rotate.apply(this, args);
  //     case "scale": return this.Scale.apply(this, args);
  //     case "will-change": return this.WillChange.apply(this, args);
  //     case "visibility": return this.Visibility.apply(this, args);
  //     case "white-space": return this.WhiteSpace.apply(this, args);
  //     case "word-break": return this.WordBreak.apply(this, args);
  //     case "word-spacing": return this.WordSpacing.apply(this, args);
  //     case "word-wrap": return this.WordWrap.apply(this, args);
  //     case "z-index": return this.ZIndex.apply(this, args);
  //     case "font": return this.Font.apply(this, args);
  //     case "font-stretch": return this.FontStretch.apply(this, args);
  //     case "font-variant": return this.FontVariant.apply(this, args);
  //     case "letter-spacing": return this.LetterSpacing.apply(this, args);
  //     case "text-decoration": return this.TextDecoration.apply(this, args);
  //     case "text-decoration-color": return this.TextDecorationColor.apply(this, args);
  //     case "text-decoration-thickness": return this.TextDecorationThickness.apply(this, args);
  //     case "text-decoration-line": return this.TextDecorationLine.apply(this, args);
  //     case "text-decoration-style": return this.TextDecorationStyle.apply(this, args);
  //     case "text-emphasis": return this.TextEmphasis.apply(this, args);
  //     case "text-emphasis-color": return this.TextEmphasisColor.apply(this, args);
  //     case "text-emphasis-position": return this.TextEmphasisPosition.apply(this, args);
  //     case "text-emphasis-style": return this.TextEmphasisStyle.apply(this, args);
  //     case "text-indent": return this.TextIndent.apply(this, args);
  //     case "text-justify": return this.TextJustify.apply(this, args);
  //     case "text-orientation": return this.TextOrientation.apply(this, args);
  //     case "text-overflow": return this.TextOverflow.apply(this, args);
  //     case "text-rendering": return this.TextRendering.apply(this, args);
  //     case "text-shadow": return this.TextShadow.apply(this, args);
  //     case "text-underline-offset": return this.TextUnderlineOffset.apply(this, args);
  //     case "text-underline-position": return this.TextUnderlinePosition.apply(this, args);
  //     case "text-smoothing": return this.TextSmoothing.apply(this, args);
  //     case "font-size": return this.FontSize.apply(this, args);
  //     case "line-break": return this.LineBreak.apply(this, args);
  //     case "line-height": return this.LineHeight.apply(this, args);
  //     case "user-select": return this.UserSelect.apply(this, args);
  //     case "text-align": return this.TextAlign.apply(this, args);
  //     case "text-transform": return this.TextTransform.apply(this, args);
  //     case "font-style": return this.FontStyle.apply(this, args);
  //     case "color": return this.Color.apply(this, args);
  //     case "resize": return this.Resize.apply(this, args);
  //     case "list-style-type": return this.ListStyleType.apply(this, args);
  //     case "content": return this.Content.apply(this, args);
  //     default: return super.Apply(action, args);
  //   }
  // }
  //
  // // CSS properties
  // Animation(v, i){ return this.SetStyle("animation", v, i); }
  // Appearance(v, i){ return this.SetStyle("appearance", v, i); }
  // AppearanceNone(i){ return this.Appearance("none", i); }
  //
  // Color(v, i){ return this.SetStyle("color", v, i); }
  // ColorWhite(i){ return this.Color(this.constructor.GetWhite(), i); }
  // ColorBlack(i){ return this.Color(this.constructor.GetBlack(), i); }
  // ColorLight(i){ return this.Color(this.constructor.GetLight(), i); }
  // ColorDark(i){ return this.Color(this.constructor.GetDark(), i); }
  // ColorPrimary(i){ return this.Color(this.constructor.GetPrimary(), i); }
  // ColorInfo(i){ return this.Color(this.constructor.GetInfo(), i); }
  // ColorLink(i){ return this.Color(this.constructor.GetLink(), i); }
  // ColorSuccess(i){ return this.Color(this.constructor.GetSuccess(), i); }
  // ColorWarning(i){ return this.Color(this.constructor.GetWarning(), i); }
  // ColorDanger(i){ return this.Color(this.constructor.GetDanger(), i); }
  // ColorGrey(i){ return this.Color(this.constructor.GetGrey(), i); }
  // ColorRed(i){ return this.Color(this.constructor.GetRed(), i); }
  // ColorOrange(i){ return this.Color(this.constructor.GetOrange(), i); }
  // ColorYellow(i){ return this.Color(this.constructor.GetYellow(), i); }
  // ColorGreen(i){ return this.Color(this.constructor.GetGreen(), i); }
  // ColorTeal(i){ return this.Color(this.constructor.GetTeal(), i); }
  // ColorBlue(i){ return this.Color(this.constructor.GetBlue(), i); }
  // ColorIndigo(i){ return this.Color(this.constructor.GetIndigo(), i); }
  // ColorPurple(i){ return this.Color(this.constructor.GetPurple(), i); }
  // ColorPink(i){ return this.Color(this.constructor.GetPink(), i); }
  //
  // AlignItems(v, i){ return this.SetStyle("align-items", v, i); }
  // AlignItemsStretch(i){ return this.AlignItems("stretch", i); }
  // AlignItemsCenter(i){ return this.AlignItems("center", i); }
  // AlignItemsFlexStart(i){ return this.AlignItems("flex-start", i); }
  // AlignItemsFlexEnd(i){ return this.AlignItems("flex-end", i); }
  // AlignItemsStretch(i){ return this.AlignItems("stretch", i); }
  // AlignItemsStart(i){ return this.AlignItems("flex-start", i); }
  // AlignItemsCenter(i){ return this.AlignItems("center", i); }
  // AlignItemsEnd(i){ return this.AlignItems("flex-end", i); }
  // AlignItemsBaseline(i){ return this.AlignItems("baseline", i); }
  //
  // AlignSelf(v, i){ return this.SetStyle("align-self", v, i); }
  // AlignSelfAuto(i){ return this.AlignSelf("auto", i); }
  // AlignSelfStretch(i){ return this.AlignSelf("stretch", i); }
  // AlignSelfStart(i){ return this.AlignSelf("flex-start", i); }
  // AlignSelfCenter(i){ return this.AlignSelf("center", i); }
  // AlignSelfEnd(i){ return this.AlignSelf("flex-end", i); }
  // PlaceSelf(v, i){ return this.SetStyle("place-self", v, i); }
  //
  // AlignContent(v, i){ return this.SetStyle("align-content", v, i); }
  // AlignContentStart(i){ return this.AlignContent("flex-start", i); }
  // AlignContentCenter(i){ return this.AlignContent("center", i); }
  // AlignContentEnd(i){ return this.AlignContent("flex-end", i); }
  // AlignContentSpaceBetween(i){ return this.AlignContent("space-between", i); }
  // AlignContentSpaceAround(i){ return this.AlignContent("space-around", i); }
  // AlignContentStretch(i){ return this.AlignContent("stretch", i); }
  //
  // JustifyContent(v, i){ return this.SetStyle("justify-content", v, i); }
  // JustifyContentStart(i){ return this.JustifyContent("flex-start", i); }
  // JustifyContentCenter(i){ return this.JustifyContent("center", i); }
  // JustifyContentEnd(i){ return this.JustifyContent("flex-end", i); }
  // JustifyContentSpaceBetween(i){ return this.JustifyContent("space-between", i); }
  // JustifyContentSpaceAround(i){ return this.JustifyContent("space-around", i); }
  // JustifyContentStretch(i){ return this.JustifyContent("stretch", i); }
  //
  // PlaceContent(v, i){ return this.SetStyle("place-content", v, i); }
  // PlaceContentStart(i){ return this.PlaceContent("start", i); }
  // PlaceContentCenter(i){ return this.PlaceContent("center", i); }
  // PlaceContentEnd(i){ return this.PlaceContent("end", i); }
  // PlaceContentLeft(i){ return this.PlaceContent("left", i); }
  // PlaceContentRight(i){ return this.PlaceContent("right", i); }
  //
  // JustifyItems(v, i){ return this.SetStyle("justify-items", v, i); }
  // JustifyItemsStart(i){ return this.JustifyItems("start", i); }
  // JustifyItemsCenter(i){ return this.JustifyItems("center", i); }
  // JustifyItemsEnd(i){ return this.JustifyItems("end", i); }
  // JustifyItemsLeft(i){ return this.JustifyItems("left", i); }
  // JustifyItemsRight(i){ return this.JustifyItems("right", i); }
  //
  // PlaceItems(v, i){ return this.SetStyle("place-items", v, i); }
  // PlaceItemsStart(i){ return this.PlaceItems("start", i); }
  // PlaceItemsCenter(i){ return this.PlaceItems("center", i); }
  // PlaceItemsEnd(i){ return this.PlaceItems("end", i); }
  // PlaceItemsLeft(i){ return this.PlaceItems("left", i); }
  // PlaceItemsRight(i){ return this.PlaceItems("right", i); }
  //
  // JustifySelf(v, i){ return this.SetStyle("justify-self", v, i); }
  // JustifySelfStart(i){ return this.JustifySelf("start", i); }
  // JustifySelfCenter(i){ return this.JustifySelf("center", i); }
  // JustifySelfEnd(i){ return this.JustifySelf("end", i); }
  // JustifySelfLeft(i){ return this.JustifySelf("left", i); }
  // JustifySelfRight(i){ return this.JustifySelf("right", i); }
  //
  // Background(v, i){ return this.SetStyle("background", v, i); }
  // BackgroundAttachment(v, i){ return this.SetStyle("background-attachment", v, i); }
  // BackgroundFixed(v, i){ return this.BackgroundAttachment("fixed", i); }
  // BackgroundLocal(v, i){ return this.BackgroundAttachment("local", i); }
  // BackgroundScroll(v, i){ return this.BackgroundAttachment("scroll", i); }
  // BackgroundClip(v, i){ return this.SetStyle("background-image", v, i); }
  //
  // BackgroundImage(v, i){ return this.SetStyle("background-image", v, i); }
  // BackgroundImageURL(v, i){ return this.BackgroundImage(`url("${v}")`, i); }
  //
  // BackgroundPosition(v, i){ return this.SetStyle("background-position", v, i); }
  // BackgroundPositionTop(i){ return this.BackgroundPosition("top", i); }
  // BackgroundPositionBottom(i){ return this.BackgroundPosition("bottom", i); }
  // BackgroundPositionLeft(i){ return this.BackgroundPosition("left", i); }
  // BackgroundPositionRight(i){ return this.BackgroundPosition("right", i); }
  // BackgroundPositionCenter(i){ return this.BackgroundPosition("center", i); }
  //
  // BackgroundRepeat(v, i){ return this.SetStyle("background-repeat", v, i); }
  // BackgroundRepeatNoRepeat(i){ return this.BackgroundRepeat("no-repeat", i); }
  //
  // BackgroundOrigin(v, i){ return this.SetStyle("background-origin", v, i); }
  // BackgroundOriginBorderBox(i){ return this.BackgroundOrigin("border-box", i); }
  // BackgroundOriginPaddingBox(i){ return this.BackgroundOrigin("padding-box", i); }
  // BackgroundOriginContentBox(i){ return this.BackgroundOrigin("content-box", i); }
  //
  // BackgroundSize(v, i){ return this.SetStyle("background-size", v, i); }
  //
  // BackgroundColor(v, i){ return this.SetStyle("background-color", v, i); }
  // BackgroundColorWhite(i){ return this.BackgroundColor(this.constructor.GetWhite(), i); }
  // BackgroundColorBlack(i){ return this.BackgroundColor(this.constructor.GetBlack(), i); }
  // BackgroundColorLight(i){ return this.BackgroundColor(this.constructor.GetLight(), i); }
  // BackgroundColorDark(i){ return this.BackgroundColor(this.constructor.GetDark(), i); }
  // BackgroundColorPrimary(i){ return this.BackgroundColor(this.constructor.GetPrimary(), i); }
  // BackgroundColorInfo(i){ return this.BackgroundColor(this.constructor.GetInfo(), i); }
  // BackgroundColorLink(i){ return this.BackgroundColor(this.constructor.GetLink(), i); }
  // BackgroundColorSuccess(i){ return this.BackgroundColor(this.constructor.GetSuccess(), i); }
  // BackgroundColorWarning(i){ return this.BackgroundColor(this.constructor.GetWarning(), i); }
  // BackgroundColorDanger(i){ return this.BackgroundColor(this.constructor.GetDanger(), i); }
  // BackgroundColorGrey(i){ return this.BackgroundColor(this.constructor.GetGrey(), i); }
  // BackgroundColorRed(i){ return this.BackgroundColor(this.constructor.GetRed(), i); }
  // BackgroundColorOrange(i){ return this.BackgroundColor(this.constructor.GetOrange(), i); }
  // BackgroundColorYellow(i){ return this.BackgroundColor(this.constructor.GetYellow(), i); }
  // BackgroundColorGreen(i){ return this.BackgroundColor(this.constructor.GetGreen(), i); }
  // BackgroundColorTeal(i){ return this.BackgroundColor(this.constructor.GetTeal(), i); }
  // BackgroundColorBlue(i){ return this.BackgroundColor(this.constructor.GetBlue(), i); }
  // BackgroundColorIndigo(i){ return this.BackgroundColor(this.constructor.GetIndigo(), i); }
  // BackgroundColorPurple(i){ return this.BackgroundColor(this.constructor.GetPurple(), i); }
  // BackgroundColorPink(i){ return this.BackgroundColor(this.constructor.GetPink(), i); }
  // BackgroundColorTransparent(i){ return this.BackgroundColor("transparent", i); }
  // BackgroundColorNone(i){ return this.BackgroundColor("none", i); }
  //
  // BackgroundShadow(v, i){ return this.SetStyle("box-shadow", v, i); }
  // BackgroundShadowBase(i){ return this.BackgroundShadow(this.constructor.GetShadowBase(), i); }
  // BackgroundShadowMD(i){ return this.BackgroundShadow(this.constructor.GetShadowMD(), i); }
  // BackgroundShadowLG(i){ return this.BackgroundShadow(this.constructor.GetShadowLG(), i); }
  // BackgroundShadowXL(i){ return this.BackgroundShadow(this.constructor.GetShadowXL(), i); }
  // BackgroundShadowXL2(i){ return this.BackgroundShadow(this.constructor.GetShadowXL2(), i); }
  // BackgroundShadowInner(i){ return this.BackgroundShadow(this.constructor.GetShadowInner(), i); }
  // BackgroundShadowOutline(i){ return this.BackgroundShadow(this.constructor.GetShadowOutline(), i); }
  // BackgroundShadowTransparent(i){ return this.BackgroundShadow("transparent", i); }
  // BackgroundShadowNone(i){ return this.BackgroundShadow("none", i); }
  //
  // BoxSizing(v, i){ return this.SetStyle("box-sizing", v, i); }
  // BoxSizingContentBox(i){ return this.BoxSizing("content-box", i); }
  // BoxSizingBorderBox(i){ return this.BoxSizing("border-box", i); }
  // BoxShadow(v, i){ return this.SetStyle("box-shadow", v, i); }
  //
  // Border(v, i){ return this.SetStyle("border", v, i); }
  // BorderWidth(v, i){ return this.SetStyle("border-width", v, i); }
  // BorderStyle(v, i){ return this.SetStyle("border-style", v, i); }
  //
  // BorderColor(v, i){ return this.SetStyle("border-color", v, i); }
  // BorderColorWhite(i){ return this.BorderColor(this.constructor.GetWhite(), i); }
  // BorderColorBlack(i){ return this.BorderColor(this.constructor.GetBlack(), i); }
  // BorderColorLight(i){ return this.BorderColor(this.constructor.GetLight(), i); }
  // BorderColorDark(i){ return this.BorderColor(this.constructor.GetDark(), i); }
  // BorderColorPrimary(i){ return this.BorderColor(this.constructor.GetPrimary(), i); }
  // BorderColorInfo(i){ return this.BorderColor(this.constructor.GetInfo(), i); }
  // BorderColorLink(i){ return this.BorderColor(this.constructor.GetLink(), i); }
  // BorderColorSuccess(i){ return this.BorderColor(this.constructor.GetSuccess(), i); }
  // BorderColorWarning(i){ return this.BorderColor(this.constructor.GetWarning(), i); }
  // BorderColorDanger(i){ return this.BorderColor(this.constructor.GetDanger(), i); }
  // BorderColorGrey(i){ return this.BorderColor(this.constructor.GetGrey(), i); }
  // BorderColorRed(i){ return this.BorderColor(this.constructor.GetRed(), i); }
  // BorderColorOrange(i){ return this.BorderColor(this.constructor.GetOrange(), i); }
  // BorderColorYellow(i){ return this.BorderColor(this.constructor.GetYellow(), i); }
  // BorderColorGreen(i){ return this.BorderColor(this.constructor.GetGreen(), i); }
  // BorderColorTeal(i){ return this.BorderColor(this.constructor.GetTeal(), i); }
  // BorderColorBlue(i){ return this.BorderColor(this.constructor.GetBlue(), i); }
  // BorderColorIndigo(i){ return this.BorderColor(this.constructor.GetIndigo(), i); }
  // BorderColorPurple(i){ return this.BorderColor(this.constructor.GetPurple(), i); }
  // BorderColorPink(i){ return this.BorderColor(this.constructor.GetPink(), i); }
  //
  // BorderImage(v, i){ return this.SetStyle("border-image", v, i); }
  // BorderRadius(v, i){ return this.SetStyle("border-radius", this.constructor.GetSize(v), i); }
  // BorderTopLeftRadius(v, i){ return this.SetStyle("border-top-left-radius", v, i); }
  // BorderTopRightRadius(v, i){ return this.SetStyle("border-top-right-radius", v, i); }
  // BorderBottomLeftRadius(v, i){ return this.SetStyle("border-bottom-left-radius", v, i); }
  // BorderBottomRightRadius(v, i){ return this.SetStyle("border-bottom-right-radius", v, i); }
  // BorderLeftRadius(v, i){ return this.BorderTopLeftRadius(v, i).BorderBottomLeftRadius(v, i); }
  // BorderRightRadius(v, i){ return this.BorderTopRightRadius(v, i).BorderBottomRightRadius(v, i); }
  // BorderTopRadius(v, i){ return this.BorderTopLeftRadius(v, i).BorderTopRightRadius(v, i); }
  // BorderBottomRadius(v, i){ return this.BorderBottomLeftRadius(v, i).BorderBottomRightRadius(v, i); }
  // BorderWidth(v, i){ return this.SetStyle("border-width", v, i); }
  // BorderLeftWidth(v, i){ return this.SetStyle("border-left-width", v, i); }
  // BorderRightWidth(v, i){ return this.SetStyle("border-right-width", v, i); }
  // BorderTopWidth(v, i){ return this.SetStyle("border-top-width", v, i); }
  // BorderBottomWidth(v, i){ return this.SetStyle("border-bottom-width", v, i); }
  // BorderLeft(v, i){ return this.SetStyle("border-left", v, i); }
  // BorderRight(v, i){ return this.SetStyle("border-right", v, i); }
  // BorderTop(v, i){ return this.SetStyle("border-top", v, i); }
  // BorderBottom(v, i){ return this.SetStyle("border-bottom", v, i); }
  // BorderBottomStyle(v, i){ return this.SetStyle("border-bottom-style", v, i); }
  // BorderBottomColor(v, i){ return this.SetStyle("border-bottom-color", v, i); }
  // BorderTopStyle(v, i){ return this.SetStyle("border-top-style", v, i); }
  // BorderTopColor(v, i){ return this.SetStyle("border-top-color", v, i); }
  // BorderRightStyle(v, i){ return this.SetStyle("border-right-style", v, i); }
  // BorderRightColor(v, i){ return this.SetStyle("border-right-color", v, i); }
  // BorderLeftStyle(v, i){ return this.SetStyle("border-left-style", v, i); }
  // BorderLeftColor(v, i){ return this.SetStyle("border-left-color", v, i); }
  // BorderStyleNone  (i){ return this.BorderStyle("none"  , i); }
  // BorderStyleHidden(i){ return this.BorderStyle("hidden", i); }
  // BorderStyleDotted(i){ return this.BorderStyle("dotted", i); }
  // BorderStyleDashed(i){ return this.BorderStyle("dashed", i); }
  // BorderStyleSolid (i){ return this.BorderStyle("solid" , i); }
  // BorderStyleDouble(i){ return this.BorderStyle("double", i); }
  // BorderStyleGroove(i){ return this.BorderStyle("groove", i); }
  // BorderStyleRidge (i){ return this.BorderStyle("ridge" , i); }
  // BorderStyleInset (i){ return this.BorderStyle("inset" , i); }
  // BorderStyleOutset(i){ return this.BorderStyle("outset", i); }
  //
  // Cursor(v, i){ return this.SetStyle("cursor", v, i); }
  // CursorPointer(v, i){ return this.Cursor("pointer", i); }
  // CursorHelp(i){ return this.Cursor("help", i); }
  // CursorWait(i){ return this.Cursor("wait", i); }
  // CursorCrosshair(i){ return this.Cursor("crosshair", i); }
  // CursorNotAllowed(i){ return this.Cursor("not-allowed", i); }
  // CursorZoomIn(i){ return this.Cursor("zoom-in", i); }
  // CursorGrab(i){ return this.Cursor("grab", i); }
  //
  // Display(v, i){ return this.SetStyle("display", v, i); }
  // DisplayNone(i){ return this.Display("none", i); }
  // DisplayBlock(i){ return this.Display("block", i); }
  // DisplayInline(i){ return this.Display("inline", i); }
  // DisplayInlineBlock(i){ return this.Display("inline-block", i); }
  // DisplayTable(i){ return this.Display("table", i); }
  // DisplayInlineTable(i){ return this.Display("inline-table", i); }
  // DisplayFlex(i){ return this.Display("flex", i); }
  // DisplayInlineFlex(i){ return this.Display("inline-flex", i); }
  // DisplayGrid(i){ return this.Display("grid", i); }
  // DisplayInlineGrid(i){ return this.Display("inline-grid", i); }
  // DisplayInitial(i){ return this.Display("initial", i); }
  //
  // Flex(v, i){ return this.SetStyle("flex", v, i); }
  // FlexBasis(v, i){ return this.SetStyle("flex-basis", v, i); }
  // FlexDirection(v, i){ return this.SetStyle("flex-direction", v, i); }
  // FlexFlow(v, i){ return this.SetStyle("flex-flow", v, i); }
  // FlexGrow(v, i){ return this.SetStyle("flex-grow", v, i); }
  // FlexGrow0(i){ return this.FlexGrow("0", i); } // Don't grow
  // FlexGrow1(i){ return this.FlexGrow("1", i); } // Grow to fill available space
  // FlexShrink(v, i){ return this.SetStyle("flex-shrink", v, i); }
  // FlexShrink0(i){ return this.FlexShrink("0", i); } // Don't shrink
  // FlexShrink1(i){ return this.FlexShrink("1", i); } // Shrink if needed
  // FlexWrap(v, i){ return this.SetStyle("flex-wrap", v, i); }
  // FlexWrapNoWrap(i){ return this.FlexWrap("nowrap", i); }
  // FlexWrapWrap(i){ return this.FlexWrap("wrap", i); }
  // FlexWrapWrapReverse(i){ return this.FlexWrap("wrap-reverse", i); }
  // FlexDirectionRow(i){ return this.FlexDirection("row", i); }
  // FlexDirectionRowReverse(i){ return this.FlexDirection("row-reverse", i); }
  // FlexDirectionColumn(i){ return this.FlexDirection("column", i); }
  // FlexDirectionColumnReverse(i){ return this.FlexDirection("column-reverse", i); }
  // FlexInitital(i){ return this.Flex("0 1 auto", i); } // Allow a flex item to shrink but not grow
  // Flex1(i){ return this.Flex("1 1 0%", i); } // Grow and shrink as needed
  // FlexAuto(i){ return this.Flex("1 1 auto", i); } // Grow and shrink as needed, incuding initial size
  // FlexNone(i){ return this.Flex("none", i); } // Can't grow/shrink
  // FlexCenter(i)
  // {
  //   return this.DisplayFlex(i)
  //              .JustifyContentCenter(i)
  //              .AlignItemsCenter(i)
  //              .AlignContentCenter(i);
  // }
  //
  // Float(v, i){ return this.SetStyle("float", v, i); }
  // FloatNone(i){ return this.Float("none", i); }
  // FloatLeft(i){ return this.Float("left", i); }
  // FloatRight(i){ return this.Float("right", i); }
  // FloatInlineStart(i){ return this.Float("inline-start", i); }
  // FloatInlineEnd(i){ return this.Float("inline-end", i); }
  //
  // Grid(v, i){ return this.SetStyle("grid", v, i); }
  // Gap(v, i){ return this.SetStyle("gap", v, i); }
  // GridArea(v, i){ return this.SetStyle("grid-area", v, i); }
  // GridAutoColumns(v, i){ return this.SetStyle("grid-auto-columns", v, i); }
  // GridAutoFlow(v, i){ return this.SetStyle("grid-auto-flow", v, i); }
  // GridAutoRows(v, i){ return this.SetStyle("grid-auto-rows", v, i); }
  // GridColumn(v, i){ return this.SetStyle("grid-column", v, i); }
  // GridColumnStart(v, i){ return this.SetStyle("grid-column-start", v, i); }
  // GridColumnEnd(v, i){ return this.SetStyle("grid-column-end", v, i); }
  // GridRow(v, i){ return this.SetStyle("grid-row", v, i); }
  // GridRowStart(v, i){ return this.SetStyle("grid-row-start", v, i); }
  // GridRowEnd(v, i){ return this.SetStyle("grid-row-end", v, i); }
  // GridTemplate(v, i){ return this.SetStyle("grid-template", v, i); }
  // GridTemplateColumns(v, i){ return this.SetStyle("grid-template-columns", v, i); }
  // GridTemplateRows(v, i){ return this.SetStyle("grid-template-rows", v, i); }
  // ColumnGap(v, i){ return this.SetStyle("column-gap", this.constructor.GetSize(v), i); }
  // RowGap(v, i){ return this.SetStyle("row-gap", this.constructor.GetSize(v), i); }
  //
  // GridTemplateAreas(v, i)
  // {
  //   if (v instanceof window.Array)
  //   {
  //     v = `${v.map(row => `"${row}"`).join("\n")}`;
  //   }
  //
  //   return this.SetStyle("grid-template-areas", v, i);
  // }
  //
  // // GridItem(v, i){ return this.SetStyle("grid-item", v, i); }
  //
  // ImageOrientation(v, i){ return this.SetStyle("image-orientation", v, i); }
  // ImageRendering(v, i){ return this.SetStyle("image-rendering", v, i); }
  //
  // Margin(v, i){ return this.SetStyle("margin", this.constructor.GetSize(v), i); }
  // MarginLeft(v, i){ return this.SetStyle("margin-left", this.constructor.GetSize(v), i); }
  // MarginRight(v, i){ return this.SetStyle("margin-right", this.constructor.GetSize(v), i); }
  // MarginTop(v, i){ return this.SetStyle("margin-top", this.constructor.GetSize(v), i); }
  // MarginBottom(v, i){ return this.SetStyle("margin-bottom", this.constructor.GetSize(v), i); }
  // MarginX(v, i){ return this.MarginLeft(v, i).MarginRight(v, i); }
  // MarginY(v, i){ return this.MarginTop(v, i).MarginBottom(v, i); }
  // MarginXY(x, y = x, i){ return this.MarginX(x, i).MarginY(y, i); }
  //
  // Width(v, i){ return this.SetStyle("width", this.constructor.GetSize(v), i); }
  // Height(v, i){ return this.SetStyle("height", this.constructor.GetSize(v), i); }
  // Size(a, b, i){ return this.Width(a, i).Height(b, i); }
  // MaxWidth(v, i){ return this.SetStyle("max-width", this.constructor.GetSize(v), i); }
  // MaxHeight(v, i){ return this.SetStyle("max-height", this.constructor.GetSize(v), i); }
  // MaxSize(a, b, i){ return this.MaxWidth(a, i).MaxHeight(b, i); }
  // MinWidth(v, i){ return this.SetStyle("min-width", this.constructor.GetSize(v), i); }
  // MinHeight(v, i){ return this.SetStyle("min-height", this.constructor.GetSize(v), i); }
  // MinSize(a, b, i){ return this.MinWidth(a, i).MinHeight(b, i); }
  //
  // Top(v, i){ return this.SetStyle("top", v, i); }
  // Bottom(v, i){ return this.SetStyle("bottom", v, i); }
  // Left(v, i){ return this.SetStyle("left", v, i); }
  // Right(v, i){ return this.SetStyle("right", v, i); }
  //
  // // SVG styling
  // Fill(v, i){ return this.SetStyle("fill", v, i); }
  // Stroke(v, i){ return this.SetStyle("stroke", v, i); }
  // StrokeWidth(v, i){ return this.SetStyle("stroke-width", v, i); }
  //
  // Order(v, i){ return this.SetStyle("order", v, i); }
  // Outline(v, i){ return this.SetStyle("outline", v, i); }
  //
  // OutlineColor(v, i){ return this.SetStyle("outline-color", v, i); }
  // OutlineColorWhite(i){ return this.OutlineColor(this.constructor.GetWhite(), i); }
  // OutlineColorBlack(i){ return this.OutlineColor(this.constructor.GetBlack(), i); }
  // OutlineColorLight(i){ return this.OutlineColor(this.constructor.GetLight(), i); }
  // OutlineColorDark(i){ return this.OutlineColor(this.constructor.GetDark(), i); }
  // OutlineColorPrimary(i){ return this.OutlineColor(this.constructor.GetPrimary(), i); }
  // OutlineColorInfo(i){ return this.OutlineColor(this.constructor.GetInfo(), i); }
  // OutlineColorLink(i){ return this.OutlineColor(this.constructor.GetLink(), i); }
  // OutlineColorSuccess(i){ return this.OutlineColor(this.constructor.GetSuccess(), i); }
  // OutlineColorWarning(i){ return this.OutlineColor(this.constructor.GetWarning(), i); }
  // OutlineColorDanger(i){ return this.OutlineColor(this.constructor.GetDanger(), i); }
  // OutlineColorGrey(i){ return this.OutlineColor(this.constructor.GetGrey(), i); }
  // OutlineColorRed(i){ return this.OutlineColor(this.constructor.GetRed(), i); }
  // OutlineColorOrange(i){ return this.OutlineColor(this.constructor.GetOrange(), i); }
  // OutlineColorYellow(i){ return this.OutlineColor(this.constructor.GetYellow(), i); }
  // OutlineColorGreen(i){ return this.OutlineColor(this.constructor.GetGreen(), i); }
  // OutlineColorTeal(i){ return this.OutlineColor(this.constructor.GetTeal(), i); }
  // OutlineColorBlue(i){ return this.OutlineColor(this.constructor.GetBlue(), i); }
  // OutlineColorIndigo(i){ return this.OutlineColor(this.constructor.GetIndigo(), i); }
  // OutlineColorPurple(i){ return this.OutlineColor(this.constructor.GetPurple(), i); }
  // OutlineColorPink(i){ return this.OutlineColor(this.constructor.GetPink(), i); }
  //
  // OutlineOffset(v, i){ return this.SetStyle("outline-offset", v, i); }
  // OutlineStyle(v, i){ return this.SetStyle("outline-style", v, i); }
  // OutlineStyleNone(i){ return this.OutlineStyle("none", i); }
  // OutlineStyleDotted(i){ return this.OutlineStyle("dotted", i); }
  // OutlineStyleSolid(i){ return this.OutlineStyle("solid", i); }
  // OutlineStyleDashed(i){ return this.OutlineStyle("dashed", i); }
  // OutlineStyleDouble(i){ return this.OutlineStyle("double", i); }
  // OutlineStyleGroove(i){ return this.OutlineStyle("groove", i); }
  // OutlineStyleRidge(i){ return this.OutlineStyle("ridge", i); }
  // OutlineStyleInset(i){ return this.OutlineStyle("inset", i); }
  // OutlineStyleOutset(i){ return this.OutlineStyle("outset", i); }
  // OutlineWidth(v, i){ return this.SetStyle("outline-width", v, i); }
  // OutlineNone(i){ return this.Outline("0", i); }
  //
  // Overflow(v, i){ return this.SetStyle("overflow", v, i); }
  // OverflowAuto(i){ return this.Overflow("auto", i); }
  // OverflowScroll(i){ return this.Overflow("scroll", i); }
  // OverflowHidden(i){ return this.Overflow("hidden", i); }
  // OverflowOverlay(i){ return this.Overflow("overlay", i); }
  // OverflowWrap(v, i){ return this.SetStyle("overflow-wrap", v, i); }
  // OverflowWrapBreakWord(i){ return this.OverflowWrap("break-word", i); }
  // OverflowX(v, i){ return this.SetStyle("overflow-x", v, i); }
  // OverflowY(v, i){ return this.SetStyle("overflow-y", v, i); }
  //
  // Opacity(v, i){ return this.SetStyle("opacity", v, i); }
  // Opacity0 (i){ return this.Opacity(".00", i); }
  // Opacity25(i){ return this.Opacity(".25", i); }
  // Opacity50(i){ return this.Opacity(".50", i); }
  // Opacity75(i){ return this.Opacity(".75", i); }
  // Opacity100(i){ return this.Opacity("1", i); }
  //
  // ObjectFit(v, i){ return this.SetStyle("object-fit", v, i); }
  // ObjectContain(i){ return this.ObjectFit("contain", i); }
  // ObjectCover(i){ return this.ObjectFit("cover", i); }
  // ObjectFill(i){ return this.ObjectFit("fill", i); }
  // ObjectNone(i){ return this.ObjectFit("none", i); }
  // ObjectScaleDown(i){ return this.ObjectFit("scale-down", i); }
  //
  // Padding(v, i){ return this.SetStyle("padding", this.constructor.GetSize(v), i); }
  // PaddingLeft(v, i){ return this.SetStyle("padding-left", this.constructor.GetSize(v), i); }
  // PaddingRight(v, i){ return this.SetStyle("padding-right", this.constructor.GetSize(v), i); }
  // PaddingTop(v, i){ return this.SetStyle("padding-top", this.constructor.GetSize(v), i); }
  // PaddingBottom(v, i){ return this.SetStyle("padding-bottom", this.constructor.GetSize(v), i); }
  // PaddingX(v, i){ return this.PaddingLeft(v, i).PaddingRight(v, i); }
  // PaddingY(v, i){ return this.PaddingTop(v, i).PaddingBottom(v, i); }
  // PaddingXY(x, y = x, i){ return this.PaddingX(x, i).PaddingY(y, i); }
  //
  // Position(v, i){ return this.SetStyle("position", v, i); }
  // PositionAbsolute(i){ return this.Position("absolute", i); }
  // PositionRelative(i){ return this.Position("relative", i); }
  // PositionStatic(i){ return this.Position("static", i); }
  // PositionFixed(i){ return this.Position("fixed", i); }
  // PositionSticky(i){ return this.Position("sticky", i); }
  //
  // PointerEvents(v, i){ return this.SetStyle("pointer-events", v, i); }
  // PointerEventsAuto(i){ return this.PointerEvents("auto", i); }
  // PointerEventsNone(i){ return this.PointerEvents("none", i); }
  // PointerEventsVisiblePainted(i){ return this.PointerEvents("visiblePainted", i); } // SVG only
  // PointerEventsVisibleFill(i){ return this.PointerEvents("visibleFill", i); } // SVG only
  // PointerEventsVisibleStroke(i){ return this.PointerEvents("visibleStroke", i); } // SVG only
  // PointerEventsVisible(i){ return this.PointerEvents("visible", i); } // SVG only
  // PointerEventsPainted(i){ return this.PointerEvents("painted", i); } // SVG only
  // PointerEventsFill(i){ return this.PointerEvents("fill", i); } // SVG only
  // PointerEventsStroke(i){ return this.PointerEvents("stroke", i); } // SVG only
  // PointerEventsAll(i){ return this.PointerEvents("all", i); } // SVG only
  //
  // TabSize(v, i){ return this.SetStyle("tab-size", v, i); }
  // TableLayout(v, i){ return this.SetStyle("table-layout", v, i); }
  // TextSizeAdjust(v, i){ return this.SetStyle("text-size-adjust", v, i); }
  // FontFamily(v, i){ return this.SetStyle("font-family", v, i); }
  // FontWeight(v, i){ return this.SetStyle("font-weight", v, i); }
  // FontFeatureSettings(v, i){ return this.SetStyle("font-feature-settings", v, i); }
  // FontVariantLigatures(v, i){ return this.SetStyle("font-variant-ligatures", v, i); }
  // FontVariantCaps(v, i){ return this.SetStyle("font-variant-caps", v, i); }
  // FontVariantNumeric(v, i){ return this.SetStyle("font-variant-numeric", v, i); }
  // FontVariantEastAsian(v, i){ return this.SetStyle("font-variant-east-asian", v, i); }
  // FontStretch(v, i){ return this.SetStyle("font-stretch", v, i); }
  // VerticalAlign(v, i){ return this.SetStyle("vertical-align", v, i); }
  // WebkitAppearance(v, i){ return this.SetStyle("-webkit-appearance", v, i); }
  // UserSelect(v, i){ return this.SetStyle("user-select", v, i); }
  // BorderImageSource(v, i){ return this.SetStyle("border-image-source", v, i); }
  // BorderImageSlice(v, i){ return this.SetStyle("border-image-slice", v, i); }
  // BorderImageOutset(v, i){ return this.SetStyle("border-image-outset", v, i); }
  // BorderImageWidth(v, i){ return this.SetStyle("border-image-width", v, i); }
  // BorderImageRepeat(v, i){ return this.SetStyle("border-image-repeat", v, i); }
  //
  // AnimationDuration(v, i){ return this.SetStyle("animation-duration", v, i); }
  // AnimationTimingFunction(v, i){ return this.SetStyle("animation-timing-function", v, i); }
  // AnimationDelay(v, i){ return this.SetStyle("animation-delay", v, i); }
  // AnimationIterationCount(v, i){ return this.SetStyle("animation-iteration-count", v, i); }
  // AnimationIterationCountInfinite(i){ return this.AnimationIterationCount("infinite", i); }
  // AnimationDirection(v, i){ return this.SetStyle("animation-direction", v, i); }
  // AnimationDirectionNormal(i){ return this.AnimationDirection("normal", i); }
  // AnimationDirectionReverse(i){ return this.AnimationDirection("reverse", i); }
  // AnimationDirectionAlternate(i){ return this.AnimationDirection("alternate", i); }
  // AnimationDirectionAlternateReverse(i){ return this.AnimationDirection("alternate-reverse", i); }
  // AnimationFillMode(v, i){ return this.SetStyle("animation-fill-mode", v, i); }
  // AnimationPlayState(v, i){ return this.SetStyle("animation-play-state", v, i); }
  // AnimationName(v, i){ return this.SetStyle("animation-name", v, i); }
  //
  // AnimationPlayState(v, i)
  // {
  //   const result = this.SetStyle("animation-play-state", v, i);
  //
  //   const animations = this.GetAnimations();
  //   for (let i = 0; i < animations.length; i++)
  //   {
  //     const animation = animations[i];
  //
  //     if (v === "paused")
  //     {
  //       animation.pause();
  //     }
  //     else if (v === "running")
  //     {
  //       animation.play(); // Does play restart it if it's running?
  //     }
  //   }
  //
  //   return result;
  // }
  //
  // ListStyleProperty(v, i){ return this.SetStyle("list-style-property", v, i); }
  // ListStylePosition(v, i){ return this.SetStyle("list-style-position", v, i); }
  // ListStyleImage(v, i){ return this.SetStyle("list-style-image", v, i); }
  // ListStyleType(v, i){ return this.SetStyle("list-style-type", v, i); }
  // BorderCollapse(v, i){ return this.SetStyle("border-collapse", v, i); }
  //
  // WebkitBorderHorizontalSpacing(v, i){ return this.SetStyle("-webkit-border-horizontal-spacing", v, i); }
  // WebkitBorderVerticalSpacing(v, i){ return this.SetStyle("-webkit-border-vertical-spacing", v, i); }
  // WebkitFontSmoothing(v, i){ return this.SetStyle("-webkit-font-smoothing", v, i); }
  // Clip(v, i){ return this.SetStyle("clip", v, i); }
  // // ColumnGap(v, i){ return this.SetStyle("--columnGap", v, i); }
  // BackgroundPositionX(v, i){ return this.SetStyle("background-position-x", v, i); }
  // BackgroundPositionY(v, i){ return this.SetStyle("background-position-y", v, i); }
  // BackgroundRepeatX(v, i){ return this.SetStyle("background-repeat-x", v, i); }
  // BackgroundRepeatY(v, i){ return this.SetStyle("background-repeat-y", v, i); }
  //
  // Transition(v, i){ return this.SetStyle("transition", v, i); }
  // TransitionProperty(v, i){ return this.SetStyle("transition-property", v, i); }
  // TransitionDuration(v, i){ return this.SetStyle("transition-duration", this.TimeCSS(v), i); }
  // TransitionTimingFunction(v, i){ return this.SetStyle("transition-timing-function", v, i); }
  // TransitionTimingFunctionLinear(i){ return this.TransitionTimingFunction("linear", i); }
  // TransitionTimingFunctionEaseIn(i){ return this.TransitionTimingFunction("ease-in", i); }
  // TransitionTimingFunctionEaseOut(i){ return this.TransitionTimingFunction("ease-out", i); }
  // TransitionTimingFunctionEaseInOut(i){ return this.TransitionTimingFunction("ease-in-out", i); }
  // TransitionTimingFunctionSteps(a, b, i){ return this.TransitionTimingFunction(this.StepsCSS(a, b), i); }
  // TransitionTimingFunctionCubicBezier(a, b, c, d, i){ return this.TransitionTimingFunction(this.CubicBezierCSS(a, b, c, d), i); }
  // TransitionDelay(v, i){ return this.SetStyle("transition-delay", v, i); }
  //
  // Transform(v, i){ return this.SetStyle("transform", v, i); }
  // TransformMatrix(m, i){ return this.AppendStyle("transform", `matrix(${m.join(", ")}`, i); }
  // TransformMatrix3D(m, i){ return this.AppendStyle("transform", `matrix3d(${m.join(", ")}`, i); }
  // TransformPerspective(v, i){ return this.AppendStyle("transform", `perspective(${this.constructor.ToPixel(v)}`, i); }
  // TransformTranslate(x, y, z, i){ return this.AppendStyle("transform", `translate(${this.constructor.ToPixel(x)}, ${this.constructor.ToPixel(y)}, ${this.constructor.ToPixel(z)})`, i); }
  // TransformTranslateX(v, i){ return this.AppendStyle("transform", `translateX(${this.constructor.ToPixel(v)})`, i); }
  // TransformTranslateY(v, i){ return this.AppendStyle("transform", `translateY(${this.constructor.ToPixel(v)})`, i); }
  // TransformTranslateZ(v, i){ return this.AppendStyle("transform", `translateZ(${this.constructor.ToPixel(v)})`, i); }
  // TransformTranslate3D(x, y, z, i){ return this.AppendStyle("transform", `translate3d(${x}, ${y}, ${z})`, i); }
  // TransformScale(x, y, i){ return this.AppendStyle("transform", `scale(${x}, ${y})`, i); }
  // TransformScale3D(x, y, z, i){ return this.AppendStyle("transform", `scale3d(${x}, ${y}, ${z})`, i); }
  // TransformScaleX(v, i){ return this.AppendStyle("transform", `scaleX(${v})`, i); }
  // TransformScaleY(v, i){ return this.AppendStyle("transform", `scaleY(${v})`, i); }
  // TransformScaleZ(v, i){ return this.AppendStyle("transform", `scaleZ(${v})`, i); }
  // TransformSkew(x, y, i){ return this.AppendStyle("transform", `skew(${this.constructor.ToDegree(x)}, ${this.constructor.ToDegree(y)})`, i); }
  // TransformSkewX(v, i){ return this.AppendStyle("transform", `skewX(${this.constructor.ToDegree(v)})`, i); }
  // TransformSkewY(v, i){ return this.AppendStyle("transform", `skewY(${this.constructor.ToDegree(v)})`, i); }
  // TransformRotate(v, i){ return this.AppendStyle("transform", `rotate(${this.constructor.ToDegree(v)})`, i, v); }
  // TransformRotateX(v, i){ return this.AppendStyle("transform", `rotateX(${this.constructor.ToDegree(v)})`, i); }
  // TransformRotateY(v, i){ return this.AppendStyle("transform", `rotateY(${this.constructor.ToDegree(v)})`, i); }
  // TransformRotateZ(v, i){ return this.AppendStyle("transform", `rotateZ(${this.constructor.ToDegree(v)})`, i); }
  // TransformOrigin(v, i){ return this.SetStyle("transform-origin", v, i); }
  // TransformOriginLeft(v, i){ return this.SetStyle("transform-origin-left", v, i); }
  // TransformOriginRight(v, i){ return this.SetStyle("transform-origin-right", v, i); }
  // Translate(v, i){ return this.SetStyle("translate", v, i); }
  // Turn(v, i){ return this.SetStyle("turn", v, i); }
  // Rotate(v, i){ return this.SetStyle("rotate", v, i); }
  // Scale(v, i){ return this.SetStyle("scale", v, i); }
  // WillChange(v, i){ return this.SetStyle("will-change", v, i); }
  //
  // Visibility(v, i){ return this.SetStyle("visibility", v, i); }
  // VisibilityVisible(i){ return this.Visibility("visible", i); }
  // VisibilityHidden(i){ return this.Visibility("hidden", i); }
  // VisibilityCollapse(i){ return this.Visibility("collapse", i); }
  //
  // WhiteSpace(v, i){ return this.SetStyle("white-space", v, i); }
  // WhiteSpaceNormal(i){ return this.WhiteSpace("normal", i); }
  // WhiteSpaceNoWrap(i){ return this.WhiteSpace("nowrap", i); }
  // WhiteSpacePre(i){ return this.WhiteSpace("pre", i); }
  // WhiteSpacePreWrap(i){ return this.WhiteSpace("pre-wrap", i); }
  // WhiteSpacePreLine(i){ return this.WhiteSpace("pre-line", i); }
  // WhiteSpaceBreakSpaces(i){ return this.WhiteSpace("break-spaces", i); }
  //
  // WordBreak(v, i){ return this.SetStyle("word-break", v, i); }
  // WordSpacing(v, i){ return this.SetStyle("word-spacing", v, i); }
  // WordWrap(v, i){ return this.SetStyle("word-wrap", v, i); }
  // WordWrapNormal(i){ return this.WordWrap("normal", i); }
  //
  // ZIndex(v, i){ return this.SetStyle("z-index", v, i); }
  //
  // BorderTransparent(i){ return this.BorderColor("transparent", i); }
  //
  // Font(v, i){ return this.SetStyle("font", v, i); }
  // FontStretch(v, i){ return this.SetStyle("font-stretch", v, i); }
  // FontVariant(v, i){ return this.SetStyle("font-variant", v, i); }
  //
  // // NOTE: Credit to tailwind (https://tailwindcss.com/) for these spacings
  // LetterSpacing(v, i){ return this.SetStyle("letter-spacing", v, i); }
  // LetterSpacingTighter(i){ return this.LetterSpacing("-0.05em", i); }
  // LetterSpacingTight(i){ return this.LetterSpacing("-0.025em", i); }
  // LetterSpacingNormal(i){ return this.LetterSpacing("0", i); }
  // LetterSpacingWide(i){ return this.LetterSpacing("0.025em", i); }
  // LetterSpacingWider(i){ return this.LetterSpacing("0.05em", i); }
  // LetterSpacingWidest(i){ return this.LetterSpacing("0.1em", i); }
  //
  // TextDecoration(v, i){ return this.SetStyle("text-decoration", v, i); }
  // TextDecorationNone(i){ return this.TextDecoration("none", i); }
  //
  // TextDecorationColor(v, i){ return this.SetStyle("text-decoration-color", v, i); }
  // TextDecorationThickness(v, i){ return this.SetStyle("text-decoration-thickness", v, i); }
  //
  // TextDecorationLine(v, i){ return this.SetStyle("text-decoration-line", v, i); }
  // TextDecorationLineNone(i){ return this.TextDecorationLine("none", i); }
  // TextDecorationLineUnderline(i){ return this.TextDecorationLine("underline", i); }
  // TextDecorationLineOverline(i){ return this.TextDecorationLine("overline", i); }
  // TextDecorationLineLineThrough(i){ return this.TextDecorationLine("line-through", i); }
  // TextDecorationLineBlink(i){ return this.TextDecorationLine("blink", i); }
  //
  // TextDecorationStyle(v, i){ return this.SetStyle("text-decoration-style", v, i); }
  // TextDecorationStyleSolid(i){ return this.TextDecorationStyle("solid", i); }
  // TextDecorationStyleDouble(i){ return this.TextDecorationStyle("double", i); }
  // TextDecorationStyleDotted(i){ return this.TextDecorationStyle("dotted", i); }
  // TextDecorationStyleDashed(i){ return this.TextDecorationStyle("dashed", i); }
  // TextDecorationStyleWavy(i){ return this.TextDecorationStyle("wavy", i); }
  //
  // TextEmphasis(v, i){ return this.SetStyle("text-emphasis", v, i); }
  // TextEmphasisColor(v, i){ return this.SetStyle("text-emphasis-color", v, i); }
  // TextEmphasisPosition(v, i){ return this.SetStyle("text-emphasis-position", v, i); }
  // TextEmphasisStyle(v, i){ return this.SetStyle("text-emphasis-style", v, i); }
  // TextIndent(v, i){ return this.SetStyle("text-indent", v, i); }
  // TextJustify(v, i){ return this.SetStyle("text-justify", v, i); }
  // TextOrientation(v, i){ return this.SetStyle("text-orientation", v, i); }
  // TextOverflow(v, i){ return this.SetStyle("text-overflow", v, i); }
  // TextOverflowEllipses(i){ return this.TextOverflow("ellipsis", i); }
  // TextRendering(v, i){ return this.SetStyle("text-rendering", v, i); }
  // TextShadow(v, i){ return this.SetStyle("text-shadow", v, i); }
  // TextUnderlineOffset(v, i){ return this.SetStyle("text-underline-offset", v, i); }
  // TextUnderlinePosition(v, i){ return this.SetStyle("text-underline-position", v, i); }
  //
  // // NOTE: Credit to tailwind (https://tailwindcss.com/) for these weights
  // FontWeightHairline(i){ return this.FontWeight("100", i); }
  // FontWeightThin(i){ return this.FontWeight("200", i); }
  // FontWeightLight(i){ return this.FontWeight("300", i); }
  // FontWeightNormal(i){ return this.FontWeight("400", i); }
  // FontWeightMedium(i){ return this.FontWeight("500", i); }
  // FontWeightSemibold(i){ return this.FontWeight("600", i); }
  // FontWeightBold(i){ return this.FontWeight("700", i); }
  // FontWeightExtrabold(i){ return this.FontWeight("800", i); }
  // FontWeightBlack(i){ return this.FontWeight("900", i); }
  //
  // // NOTE: Credit to tailwind (https://tailwindcss.com/) for these sizes
  // FontSize(v, i){ return this.SetStyle("font-size", this.constructor.GetSize(v), i); }
  // FontSizeXS  (i){ return this.FontSize("0.75rem", i); }
  // FontSizeSM  (i){ return this.FontSize("0.875rem", i); }
  // FontSizeBase(i){ return this.FontSize("1rem", i); }
  // FontSizeLG  (i){ return this.FontSize("1.125rem", i); }
  // FontSizeXL  (i){ return this.FontSize("1.25rem", i); }
  // FontSizeXL2 (i){ return this.FontSize("1.5rem", i); }
  // FontSizeXL3 (i){ return this.FontSize("1.875rem", i); }
  // FontSizeXL4 (i){ return this.FontSize("2.25rem", i); }
  // FontSizeXL5 (i){ return this.FontSize("3rem", i); }
  // FontSizeXL6 (i){ return this.FontSize("4rem", i); }
  //
  // LineBreak(v, i){ return this.SetStyle("line-break", v, i); }
  // LineBreakAuto(i){ return this.LineBreak("auto", i); }
  // LineBreakLoose(i){ return this.LineBreak("loose", i); }
  // LineBreakNormal(i){ return this.LineBreak("normal", i); }
  // LineBreakStrict(i){ return this.LineBreak("strict", i); }
  // LineBreakAnywhere(i){ return this.LineBreak("anywhere", i); }
  //
  // LineHeight(v, i){ return this.SetStyle("line-height", v, i); }
  // LineHeightNone(i){ return this.LineHeight("1", i); }
  // LineHeightTight(i){ return this.LineHeight("1.25", i); }
  // LineHeightSnug(i){ return this.LineHeight("1.375", i); }
  // LineHeightNormal(i){ return this.LineHeight("1.5", i); }
  // LineHeightRelaxed(i){ return this.LineHeight("1.625", i); }
  // LineHeightLoose(i){ return this.LineHeight("2", i); }
  //
  // UserSelect(v, i){ return this.SetStyle("user-select", v, i); }
  // UserSelectNone(i){ return this.UserSelect("none", i); }
  // UserSelectText(i){ return this.UserSelect("text", i); }
  // UserSelectAll(i){ return this.UserSelect("all", i); }
  // UserSelectAuto(i){ return this.UserSelect("auto", i); }
  //
  // TextAlign(v, i){ return this.SetStyle("text-align", v, i); }
  // TextAlignCenter(i){ return this.TextAlign("center", i); }
  // TextAlignJustify(i){ return this.TextAlign("justify", i); }
  // TextAlignLeft(i){ return this.TextAlign("left", i); }
  // TextAlignRight(i){ return this.TextAlign("left", i); }
  //
  // TextTransform(v, i){ return this.SetStyle("text-transform", v, i); }
  // TextTransformCapitalize(i){ return this.TextTransform("capitalize", i); }
  // TextTransformLowercase(i){ return this.TextTransform("lowercase", i); }
  // TextTransformUppercase(i){ return this.TextTransform("uppercase", i); }
  // TextTransformNone(i){ return this.TextTransform("none", i); }
  // TextTransformFullWidth(i){ return this.TextTransform("full-width", i); }
  // TextTransformFullSizeKana(i){ return this.TextTransform("full-size-kana", i); }
  //
  // FontStyle(v, i){ return this.SetStyle("font-style", v, i); }
  // FontStyleItalic(i){ return this.FontStyle("italic", i); }
  // FontStyleNormal(i){ return this.FontStyle("normal", i); }
  // FontStyleOblique(i){ return this.FontStyle("oblique", i); }
  //
  // TextTruncate(i){ return this.OverflowHidden(i).TextOverflowEllipses(i).WhiteSpaceNoWrap(i); }
  //
  // // NOTE: Credit to Bulma (https://bulma.io/) for these font settings
  // FontFamilyPrimary(i){ return this.FontFamilySansSerif(i); }
  // FontFamilySecondary(i){ return this.FontFamilySansSerif(i); }
  // FontFamilyCode(i){ return this.FontFamilyMonoSpace(i); }
  // FontFamilySansSerif(i){ return this.FontFamily(`BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;`, i); }
  // FontFamilyMonoSpace(i){ return this.FontFamily("monospace", i); }
  //
  // Resize(v, i){ return this.SetStyle("resize", v, i); }
  // ResizeNone(i){ return this.Resize("none", i); }
  // ResizeBoth(i){ return this.Resize("both", i); }
  // ResizeVertical(i){ return this.Resize("vertical", i); }
  // ResizeHorizontal(i){ return this.Resize("horizontal", i); }
  // ResizeY(i){ return this.ResizeVertical(i); }
  // ResizeX(i){ return this.ResizeHorizontal(i); }
  //
  // ListStyleType(v, i){ return this.SetStyle("list-style-type", v, i); }
  // ListStyleTypeSpaceCounter(i){ return this.ListStyleType("space-counter", i); }
  // ListStyleTypeDisc(i){ return this.ListStyleType("disc", i); }
  // ListStyleTypeCircle(i){ return this.ListStyleType("circle", i); }
  // ListStyleTypeSquare(i){ return this.ListStyleType("square", i); }
  // ListStyleTypeDecimal(i){ return this.ListStyleType("decimal", i); }
  // ListStyleTypeGeorgian(i){ return this.ListStyleType("georgian", i); }
  // ListStyleTypeTradChineseInformal(i){ return this.ListStyleType("trad-chinese-informal", i); }
  // ListStyleTypeKannada(i){ return this.ListStyleType("kannada", i); }
  // ListStyleTypeNone(i){ return this.ListStyleType("none", i); }
  // ListStyleTypeInherit(i){ return this.ListStyleType("inherit", i); }
  // ListStyleTypeInitial(i){ return this.ListStyleType("initial", i); }
  // ListStyleTypeUnset(i){ return this.ListStyleType("unset", i); }
  // ListStyleTypeLowerAlpha(i){ return this.ListStyleType("lower-alpha", i); }
  // ListStyleTypeUpperAlpha(i){ return this.ListStyleType("upper-alpha", i); }
  // ListStyleTypeLowerLatin(i){ return this.ListStyleType("lower-latin", i); }
  // ListStyleTypeUpperLatin(i){ return this.ListStyleType("upper-latin", i); }
  // ListStyleTypeLowerRoman(i){ return this.ListStyleType("lower-roman", i); }
  // ListStyleTypeUpperRoman(i){ return this.ListStyleType("upper-roman", i); }
  //
  // Overlayed(i){ return this.PositionAbsolute(i).Left(0, i).Right(0, i).Top(0, i).Bottom(0, i); }
  // Flexible(i){ return this.DisplayFlex(i).AlignItemsCenter(i); }
  // Antialiased(i){ return this.TextSmoothing("antialiased", "grayscale", i); }
  // SubpixelAntialiased(i){ return this.TextSmoothing("auto", "auto", i); }
  // Bordered(i){ return this.BorderWidth("1px", i); }
  // Rounded(i){ return this.BorderRadius("0.25rem", i); }
  // RoundedFull(i){ return this.BorderRadius("9999px", i); }
  // Circular(i){ return this.BorderRadius("290486px", i); }
  // Wide(i){ return this.Width("100%", i); }
  // Tall(i){ return this.Height("100%", i); }
  //
  // Contain(v, i){ return this.SetStyle("contain", v, i); }
  //
  // Content(v){ return this.SetStyle("content", `"${v}"`); }
  //
  // Inset(v, i){ return this.SetStyle("inset", v, i); }
}

Freeze(Styles);
