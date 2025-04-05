import {StringBuilder as Base} from "/js/Utility/StringBuilder.js?after=/taggly/private/";
import {ConsoleColors as C} from "/js/Utility/ConsoleColors.js";

const formatter = new Intl.NumberFormat();

export class StringBuilder extends Base
{
  Reset(s){ return this.Add(C.Reset(s)); }
  Bold(s){ return this.Add(C.Bold(s)); }
  Dim(s){ return this.Add(C.Dim(s)); }
  Italic(s){ return this.Add(C.Italic(s)); }
  Underline(s){ return this.Add(C.Underline(s)); }
  Inverse(s){ return this.Add(C.Inverse(s)); }
  Hidden(s){ return this.Add(C.Hidden(s)); }
  Strikethrough(s){ return this.Add(C.Strikethrough(s)); }
  Black(s){ return this.Add(C.Black(s)); }
  Red(s){ return this.Add(C.Red(s)); }
  Green(s){ return this.Add(C.Green(s)); }
  Yellow(s){ return this.Add(C.Yellow(s)); }
  Blue(s){ return this.Add(C.Blue(s)); }
  Magenta(s){ return this.Add(C.Magenta(s)); }
  Cyan(s){ return this.Add(C.Cyan(s)); }
  White(s){ return this.Add(C.White(s)); }
  Gray(s){ return this.Add(C.Gray(s)); }
  Grey(s){ return this.Add(C.Grey(s)); }
  RedBright(s){ return this.Add(C.RedBright(s)); }
  GreenBright(s){ return this.Add(C.GreenBright(s)); }
  YellowBright(s){ return this.Add(C.YellowBright(s)); }
  BlueBright(s){ return this.Add(C.BlueBright(s)); }
  MagentaBright(s){ return this.Add(C.MagentaBright(s)); }
  CyanBright(s){ return this.Add(C.CyanBright(s)); }
  WhiteBright(s){ return this.Add(C.WhiteBright(s)); }
  BlackBG(s){ return this.Add(C.BlackBG(s)); }
  RedBG(s){ return this.Add(C.RedBG(s)); }
  GreenBG(s){ return this.Add(C.GreenBG(s)); }
  YellowBG(s){ return this.Add(C.YellowBG(s)); }
  BlueBG(s){ return this.Add(C.BlueBG(s)); }
  MagentaBG(s){ return this.Add(C.MagentaBG(s)); }
  CyanBG(s){ return this.Add(C.CyanBG(s)); }
  WhiteBG(s){ return this.Add(C.WhiteBG(s)); }
  GrayBG(s){ return this.Add(C.GrayBG(s)); }
  GreyBG(s){ return this.Add(C.GreyBG(s)); }
  RedBrightBG(s){ return this.Add(C.RedBrightBG(s)); }
  GreenBrightBG(s){ return this.Add(C.GreenBrightBG(s)); }
  YellowBrightBG(s){ return this.Add(C.YellowBrightBG(s)); }
  BlueBrightBG(s){ return this.Add(C.BlueBrightBG(s)); }
  MagentaBrightBG(s){ return this.Add(C.MagentaBrightBG(s)); }
  CyanBrightBG(s){ return this.Add(C.CyanBrightBG(s)); }
  WhiteBrightBG(s){ return this.Add(C.WhiteBrightBG(s)); }

  Log(s){ return this.Cyan(s); }
  Warn(s){ return this.YellowBright(s); }
  Error(s){ return this.RedBright(s); }
  URL(s){ return this.Underline(C.Cyan(s)); }
  Number(s){ return this.Green(formatter.format(s)); }
  Function(s) {return this.Bold(s); }
  String(s){ return this.YellowBright(s); }
}