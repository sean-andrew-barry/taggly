import {OrdinalDatePart} from "/js/External/OrdinalDatePart.js";

export class DateTimeFormatter
{
  constructor(date, utc = false)
  {
    this.date = date;
    this.parts = [];
    this.utc = utc;
  }

  Push(local, utc, ...args)
  {
    const fn = this.date[this.utc ? utc : local];
    this.parts.push(fn.apply(this.date, args));

    return this;
  }

  Add(value){ this.parts.push(value); return this; }

  Millisecond(){ return this.Push("GetMillisecond", "GetMillisecondUTC"); }
  Second(){ return this.Push("GetSecond", "GetSecondUTC"); }
  Minute(){ return this.Push("GetMinute", "GetMinuteUTC"); }
  Hour(){ return this.Push("GetHour", "GetHourUTC"); }

  Month(){ return this.Push("GetMonth", "GetMonthUTC"); }
  Day(){ return this.Push("GetDay", "GetDayUTC"); }
  Year(){ return this.Push("GetYear", "GetYearUTC"); }

  Add(...args)
  {
    this.parts.push.apply(this.parts, args);
    return this;
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

  M(s){ return this.Add(this.date.GetMonth(), s); }
  MM(s){ return this.Add(this.Pad(this.date.GetMonth(), "00"), s); }
  MMM(s){ return this.Add(this.date.GetMonthNameShort(), s); }
  MMMM(s){ return this.Add(this.date.GetMonthName(), s); }
  Month(s){ return this.Add(this.date.GetMonthName(), s); }
  MonthShort(s){ return this.Add(this.date.GetMonthNameShort(), s); }

  D(s){ return this.Add(this.date.GetDay(), s); }
  DD(s){ return this.Add(this.Pad(this.date.GetDay(), "00"), s); }
  DDD(s){ return this.Add(this.date.GetDayNameShort(), s); }
  DDDD(s){ return this.Add(this.date.GetDayName(), s); }
  Day(s){ return this.Add(this.date.GetDayName(), s); }
  DayShort(s){ return this.Add(this.date.GetDayNameShort(), s); }

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

  Ordinal(){ return this.Add(OrdinalDatePart(this.date)); }

  Join(separator = " ")
  {
    this.parts = [this.parts.join(separator)];
    return this;
  }

  toString(separator = ""){ return this.parts.join(separator); }
}
