import {Tag} from "/js/Tag.js";
import {DateTime} from "/js/Utility/DateTime.js";
import {Tooltip} from "/js/Tags/Tooltip.js";
import {Div} from "/js/Tags/Div.js";
import {P} from "/js/Tags/P.js";

export class Date extends Tag
{
  static GetMetaURL(){ return import.meta.url; }
  static GetLocalName(){ return "date"; }

  // constructor(date)
  // {
  //   super();
  //   // this.SetNode(this.constructor.CreateText(date.toLocaleString()));
  //   this.date = new DateTime(date);
  //
  //   this.AppendChild(
  //     // new Tooltip().OnMouseOver(event =>
  //     // {
  //     //   event.tag.Add(
  //     //     Tag.P().Slot("content").Add(
  //     //       Tag.String(date.toLocaleString(), true),
  //     //       Tag.BreakLine(),
  //     //       Tag.BreakLine(),
  //     //       Tag.BreakLine(),
  //     //       Tag.String(this.date.FormatTimeSince(), true),
  //     //     ),
  //     //   );
  //     // }),
  //     new Tooltip().Add(
  //       Tag.Div().Slot("content").Add(
  //         Tag.P().Add(
  //           Tag.String(date.toLocaleString(), true),
  //         ),
  //         Tag.P().Add(
  //           Tag.String(this.date.FormatTimeSince(), true),
  //         ),
  //       ),
  //     ),
  //   );
  // }

  constructor(date)
  {
    super();

    if (date)
    {
      this.date = new DateTime(date);
    }
  }

  SetNode(node)
  {
    const result = super.SetNode(node);
    this.date ??= new DateTime(Tag.GetNodeValue(node));

    if (this.date)
    {
      // this.Add.apply(this, this.date);
      // this.AppendChild(this.constructor.CreateText(this.date.toLocaleString()));

      this.Add(this.date.ToLocaleString());
    }

    return result;
  }

  CreateTooltip()
  {
    return this.AppendChild(
      new Tooltip().Add(
        new Div().Slot("content").Add(
          new P().Text(this.date.ToLocaleString()),
          new P().Text(this.date.FormatTimeSince()),
        ),
      ),
    );
  }

  Pad(value, padding = "00", left = true)
  {
    if ((typeof(value) === "number") && (0 > value))
    {
      return "-" + this.Pad(-value, padding, left);
    }

    // CREDIT: Shyam Habarakada at https://stackoverflow.com/a/24398129. Thank you!
    if (left) return (padding + value).slice(-padding.length);
    else return (value + padding).substring(0, padding.length);
  }

  D(s){ return this.Add(this.date.GetDay(), s); }
  DD(s){ return this.Add(this.Pad(this.date.GetDay(), "00"), s); }
  DDD(s){ return this.Add(this.date.GetDayNameShort(), s); }
  DDDD(s){ return this.Add(this.date.GetDayName(), s); }
  Day(s){ return this.Add(this.date.GetDayName(), s); }
  DayShort(s){ return this.Add(this.date.GetDayNameShort(), s); }

  M(s){ return this.Add(this.date.GetMonth(), s); }
  MM(s){ return this.Add(this.Pad(this.date.GetMonth(), "00"), s); }
  MMM(s){ return this.Add(this.date.GetMonthNameShort(), s); }
  MMMM(s){ return this.Add(this.date.GetMonthName(), s); }
  Month(s){ return this.Add(this.date.GetMonthName(), s); }
  MonthShort(s){ return this.Add(this.date.GetMonthNameShort(), s); }
  // MM(){ return this.Add(this.date.GetMonth()); }

  Y(s){ return this.Add(this.date.GetYear(), s); }
  YY(s){ return this.Add(this.date.GetYear().slice(-2), s); }
  YYYY(s){ return this.Add(this.Pad(this.date.GetYear(), "0000"), s); }
  Year(s){ return this.Add(this.date.GetYear(), s); }

  h(s){ return this.Add(this.date.GetHour12(), s); }
  hh(s){ return this.Add(this.Pad(this.date.GetHour12(), "00"), s); }

  h12(s){ return this.h(s); }
  hh12(s){ return this.hh(s); }

  h24(s){ return this.Add(this.date.GetHour(), s); }
  hh24(s){ return this.Add(this.Pad(this.date.GetHour(), "00"), s); }

  m(s){ return this.Add(this.date.GetMinute(), s); }
  mm(s){ return this.Add(this.Pad(this.date.GetMinute(), "00"), s); }

  s(s){ return this.Add(this.date.GetSecond(), s); }
  ss(s){ return this.Add(this.Pad(this.date.GetSecond(), "00"), s); }

  f(s){ return this.Add(this.Pad((this.date.GetMillisecond() / 1000).toString().slice(2), "0", false), s); }
  ff(s){ return this.Add(this.Pad((this.date.GetMillisecond() / 1000).toString().slice(2), "00", false), s); }
  fff(s){ return this.Add(this.Pad(this.date.GetMillisecond() * 1, "000"), s); }
  ffff(s){ return this.Add(this.Pad(this.date.GetMillisecond() * 10, "0000"), s); }
  fffff(s){ return this.Add(this.Pad(this.date.GetMillisecond() * 100, "00000"), s); }

  t(s){ return this.Add(this.date.GetHour() >= 12 ? "P" : "A", s); }
  tt(s){ return this.Add(this.date.GetHour() >= 12 ? "PM" : "AM", s); }

  z(s){ return this.Add(this.date.GetTimeZoneOffset(), s); }
  zz(s){ return this.Add(this.Pad(this.date.GetTimeZoneOffset(), "00"), s); }

  Ordinal()
  {
    // NOTE: Taken from Randika Vishman's example at https://stackoverflow.com/a/33134344
    // Thank you!

    const d = this.date.GetDay();
    if (d > 3 && d < 21)
    {
      return this.Add(d + "th");
    }
    else
    {
      switch (d % 10)
      {
        case 1:  return this.Add(d + "st");
        case 2:  return this.Add(d + "nd");
        case 3:  return this.Add(d + "rd");
        default: return this.Add(d + "th");
      }
    }
  }

  Deconvert(){ return this.date; }
}
