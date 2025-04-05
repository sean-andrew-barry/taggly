const formatter = new Intl.NumberFormat();

export class ConsoleColors
{
  static Black  (string){ return `\x1b[30m${string}\x1b[39m`; }
  static Red    (string){ return `\x1b[31m${string}\x1b[39m`; }
  static Green  (string){ return `\x1b[32m${string}\x1b[39m`; }
  static Yellow (string){ return `\x1b[33m${string}\x1b[39m`; }
  static Blue   (string){ return `\x1b[34m${string}\x1b[39m`; }
  static Magenta(string){ return `\x1b[35m${string}\x1b[39m`; }
  static Cyan   (string){ return `\x1b[36m${string}\x1b[39m`; }
  static White  (string){ return `\x1b[37m${string}\x1b[39m`; }
  static Gray   (string){ return `\x1b[90m${string}\x1b[39m`; }

  static BrightBlack  (string){ return this.Bright(`\x1b[30m${string}\x1b[39m`); }
  static BrightRed    (string){ return this.Bright(`\x1b[31m${string}\x1b[39m`); }
  static BrightGreen  (string){ return this.Bright(`\x1b[32m${string}\x1b[39m`); }
  static BrightYellow (string){ return this.Bright(`\x1b[33m${string}\x1b[39m`); }
  static BrightBlue   (string){ return this.Bright(`\x1b[34m${string}\x1b[39m`); }
  static BrightMagenta(string){ return this.Bright(`\x1b[35m${string}\x1b[39m`); }
  static BrightCyan   (string){ return this.Bright(`\x1b[36m${string}\x1b[39m`); }
  static BrightWhite  (string){ return this.Bright(`\x1b[37m${string}\x1b[39m`); }
  static BrightGray   (string){ return this.Bright(`\x1b[90m${string}\x1b[39m`); }

  static DimBlack  (string){ return this.Dim(`\x1b[30m${string}\x1b[39m`); }
  static DimRed    (string){ return this.Dim(`\x1b[31m${string}\x1b[39m`); }
  static DimGreen  (string){ return this.Dim(`\x1b[32m${string}\x1b[39m`); }
  static DimYellow (string){ return this.Dim(`\x1b[33m${string}\x1b[39m`); }
  static DimBlue   (string){ return this.Dim(`\x1b[34m${string}\x1b[39m`); }
  static DimMagenta(string){ return this.Dim(`\x1b[35m${string}\x1b[39m`); }
  static DimCyan   (string){ return this.Dim(`\x1b[36m${string}\x1b[39m`); }
  static DimWhite  (string){ return this.Dim(`\x1b[37m${string}\x1b[39m`); }
  static DimGray   (string){ return this.Dim(`\x1b[90m${string}\x1b[39m`); }

  static BlackBG   (string){ return `\x1b[40m${string}\x1b[49m`; }
  static RedBG     (string){ return `\x1b[41m${string}\x1b[49m`; }
  static GreenBG   (string){ return `\x1b[42m${string}\x1b[49m`; }
  static YellowBG  (string){ return `\x1b[44m${string}\x1b[49m`; }
  static BlueBG    (string){ return `\x1b[44m${string}\x1b[49m`; }
  static MagentaBG (string){ return `\x1b[45m${string}\x1b[49m`; }
  static CyanBG    (string){ return `\x1b[46m${string}\x1b[49m`; }
  static WhiteBG   (string){ return `\x1b[47m${string}\x1b[49m`; }

  static Reset        (string){ return `\x1b[0m${string}\x1b[0m`; }
  static Bold         (string){ return `\x1b[1m${string}\x1b[22m`; }
  static Dim          (string){ return `\x1b[2m${string}\x1b[22m`; }
  static Italic       (string){ return `\x1b[3m${string}\x1b[23m`; }
  static Underline    (string){ return `\x1b[4m${string}\x1b[24m`; }
  static Inverse      (string){ return `\x1b[7m${string}\x1b[27m`; }
  static Hidden       (string){ return `\x1b[8m${string}\x1b[28m`; }
  static Strikethrough(string){ return `\x1b[9m${string}\x1b[29m`; }

  static Reset(s){ return `\u001b[0m${s}\u001b[0m`; }
  static Bold(s){ return `\u001b[1m${s}\u001b[22m`; }
  static Dim(s){ return `\u001b[2m${s}\u001b[22m`; }
  static Italic(s){ return `\u001b[3m${s}\u001b[23m`; }
  static Underline(s){ return `\u001b[4m${s}\u001b[24m`; }
  static Inverse(s){ return `\u001b[7m${s}\u001b[27m`; }
  static Hidden(s){ return `\u001b[8m${s}\u001b[28m`; }
  static Strikethrough(s){ return `\u001b[9m${s}\u001b[29m`; }
  static Black(s){ return `\u001b[30m${s}\u001b[39m`; }
  static Red(s){ return `\u001b[31m${s}\u001b[39m`; }
  static Green(s){ return `\u001b[32m${s}\u001b[39m`; }
  static Yellow(s){ return `\u001b[33m${s}\u001b[39m`; }
  static Blue(s){ return `\u001b[34m${s}\u001b[39m`; }
  static Magenta(s){ return `\u001b[35m${s}\u001b[39m`; }
  static Cyan(s){ return `\u001b[36m${s}\u001b[39m`; }
  static White(s){ return `\u001b[37m${s}\u001b[39m`; }
  static Gray(s){ return `\u001b[90m${s}\u001b[39m`; }
  static Grey(s){ return `\u001b[90m${s}\u001b[39m`; }
  static RedBright(s){ return `\u001b[91m${s}\u001b[39m`; }
  static GreenBright(s){ return `\u001b[92m${s}\u001b[39m`; }
  static YellowBright(s){ return `\u001b[93m${s}\u001b[39m`; }
  static BlueBright(s){ return `\u001b[94m${s}\u001b[39m`; }
  static MagentaBright(s){ return `\u001b[95m${s}\u001b[39m`; }
  static CyanBright(s){ return `\u001b[96m${s}\u001b[39m`; }
  static WhiteBright(s){ return `\u001b[97m${s}\u001b[39m`; }
  static BlackBG(s){ return `\u001b[40m${s}\u001b[49m`; }
  static RedBG(s){ return `\u001b[41m${s}\u001b[49m`; }
  static GreenBG(s){ return `\u001b[42m${s}\u001b[49m`; }
  static YellowBG(s){ return `\u001b[43m${s}\u001b[49m`; }
  static BlueBG(s){ return `\u001b[44m${s}\u001b[49m`; }
  static MagentaBG(s){ return `\u001b[45m${s}\u001b[49m`; }
  static CyanBG(s){ return `\u001b[46m${s}\u001b[49m`; }
  static WhiteBG(s){ return `\u001b[47m${s}\u001b[49m`; }
  static GrayBG(s){ return `\u001b[100m${s}\u001b[49m`; }
  static GreyBG(s){ return `\u001b[100m${s}\u001b[49m`; }
  static RedBrightBG(s){ return `\u001b[101m${s}\u001b[49m`; }
  static GreenBrightBG(s){ return `\u001b[102m${s}\u001b[49m`; }
  static YellowBrightBG(s){ return `\u001b[103m${s}\u001b[49m`; }
  static BlueBrightBG(s){ return `\u001b[104m${s}\u001b[49m`; }
  static MagentaBrightBG(s){ return `\u001b[105m${s}\u001b[49m`; }
  static CyanBrightBG(s){ return `\u001b[106m${s}\u001b[49m`; }
  static WhiteBrightBG(s){ return `\u001b[107m${s}\u001b[49m`; }

  static Log(value){ return this.Cyan(value); }
  static Warn(value){ return this.YellowBright(value); }
  static Error(value){ return this.RedBright(value); }
  static URL(value){ return this.Underline(this.Cyan(value)); }
  static Number(value){ return this.Green(formatter.format(value)); }

  static Round(value, multiplier = 100)
  {
    return this.Number(Math.floor(value * multiplier) / multiplier);
  }
}
