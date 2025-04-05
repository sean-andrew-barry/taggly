import GetDayOfYear from "/js/External/GetDayOfYear.js";
import OrdinalDatePart from "/js/External/OrdinalDatePart.js";
import FormatTimeSince from "/js/External/FormatTimeSince.js";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DAYS_SHORT = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;

// Used in DayOfYear
export const DAY_COUNT = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

export class Date extends window.Date
{
  static Now(){ return new DateTime(new Date()); }

  static GetMinuteMS(){ return ONE_MINUTE_MS; }
  static GetHourMS  (){ return ONE_HOUR_MS; }
  static GetDayMS   (){ return ONE_DAY_MS; }

  static GetMonth      (){ return MONTHS; }
  static GetMonthsShort(){ return MONTHS_SHORT; }
  static GetDays       (){ return DAYS; }
  static GetDaysShort  (){ return DAYS_SHORT; }

  static GetMonthName     (i){ return MONTHS[i]; }
  static GetMonthNameShort(i){ return MONTHS_SHORT[i]; }
  static GetDayName       (i){ return DAYS[i]; }
  static GetDayNameShort  (i){ return DAYS_SHORT[i]; }

  static GetMonthLength(year, month)
  {
    return new Date(year, month, 0).getDate() + 1;
  }

  ToStartOfDayUTC(){ this.setUTCHours(0, 0, 0, 0); return this; }
  ToStartOfDay   (){ this.setHours   (0, 0, 0, 0); return this; }

  Add     (date){ this = new Date(this + date.date); return this; }
  Subtract(date){ this = new Date(this - date.date); return this; }

  AddYears       (v){ this.setUTCFullYear    (this.getUTCFullYear    () + v); return this; }
  AddMonths      (v){ this.setUTCMonth       (this.getUTCMonth       () + v); return this; }
  AddDays        (v){ this.setUTCDate        (this.getUTCDate        () + v); return this; }
  AddHours       (v){ this.setUTCHours       (this.getUTCHours       () + v); return this; }
  AddMinutes     (v){ this.setUTCMinutes     (this.getUTCMinutes     () + v); return this; }
  AddSeconds     (v){ this.setUTCSeconds     (this.getUTCSeconds     () + v); return this; }
  AddMilliseconds(v){ this.setUTCMilliseconds(this.getUTCMilliseconds() + v); return this; }

  SubtractYears       (v){ this.setUTCFullYear    (this.getUTCFullYear    () - v); return this; }
  SubtractMonths      (v){ this.setUTCMonth       (this.getUTCMonth       () - v); return this; }
  SubtractDays        (v){ this.setUTCDate        (this.getUTCDate        () - v); return this; }
  SubtractHours       (v){ this.setUTCHours       (this.getUTCHours       () - v); return this; }
  SubtractMinutes     (v){ this.setUTCMinutes     (this.getUTCMinutes     () - v); return this; }
  SubtractSeconds     (v){ this.setUTCSeconds     (this.getUTCSeconds     () - v); return this; }
  SubtractMilliseconds(v){ this.setUTCMilliseconds(this.getUTCMilliseconds() - v); return this; }

  SetTime       (v){ this.setTime        (v); return this; }
  SetYear       (v){ this.setFullYear    (v); return this; }
  SetMonth      (v){ this.setMonth       (v); return this; }
  SetDay        (v){ this.setDate        (v); return this; }
  SetHour       (v){ this.setHours       (v); return this; }
  SetMinute     (v){ this.setMinutes     (v); return this; }
  SetSecond     (v){ this.setSeconds     (v); return this; }
  SetMillisecond(v){ this.setMilliseconds(v); return this; }

  SetYearUTC       (v){ this.setUTCFullYear    (v); return this; }
  SetMonthUTC      (v){ this.setUTCMonth       (v); return this; }
  SetDayUTC        (v){ this.setUTCDate        (v); return this; }
  SetHourUTC       (v){ this.setUTCHours       (v); return this; }
  SetMinuteUTC     (v){ this.setUTCMinutes     (v); return this; }
  SetSecondUTC     (v){ this.setUTCSeconds     (v); return this; }
  SetMillisecondUTC(v){ this.setUTCMilliseconds(v); return this; }

  GetMonthName     (){ return MONTHS[this.getMonth()]; }
  GetMonthNameShort(){ return MONTHS_SHORT[this.getMonth()]; }
  GetDayName       (){ return DAYS[this.getDay()]; }
  GetDayNameShort  (){ return DAYS_SHORT[this.getDay()]; }

  GetDayOfYear(){ return GetDayOfYear(this); }

  GetMonthLength(year, month)
  {
    return new Date(year || this.GetYear(), month || this.GetMonth(), 0).getDate() + 1;
  }

  GetTime(){ return this.getTime(); }

  GetYearUTC       (){ return this.getUTCFullYear    (); }
  GetMonthUTC      (){ return this.getUTCMonth       (); }
  GetDayUTC        (){ return this.getUTCDate        (); }
  GetHourUTC       (){ return this.getUTCHours       (); }
  GetMinuteUTC     (){ return this.getUTCMinutes     (); }
  GetSecondUTC     (){ return this.getUTCSeconds     (); }
  GetMillisecondUTC(){ return this.getUTCMilliseconds(); }

  GetYear       (){ return this.getFullYear    (); }
  GetMonth      (){ return this.getMonth       (); }
  GetDay        (){ return this.getDate        (); }
  GetWeekday    (){ return this.getDay         (); }
  GetHour       (){ return this.getHours       (); }
  GetMinute     (){ return this.getMinutes     (); }
  GetSecond     (){ return this.getSeconds     (); }
  GetMillisecond(){ return this.getMilliseconds(); }
  GetMicrosecond(){ return Math.round(this.getMilliseconds() * 1000) / 1000; }
  GetNanosecond (){ return Math.round(this.getMilliseconds() * 1000000) / 1000000; }

  h24(h){ return h > 12 ? h - 12 : h; }

  GetHourUTC12(){ return this.h24(this.GetHourUTC()); }
  GetHourUTC24(){ return this.GetHourUTC(); }
  GetHour12   (){ return this.h24(this.GetHour()); }
  GetHour24   (){ return this.GetHour(); }

  GetTimeZone()
  {
    const now = this.toString();
    return now.replace(/.*[(](.*)[)].*/, "$1"); // Extracts the content between parenthesis
  }

  GetTimeZoneOffset(){ return -(this.getTimezoneOffset() / 60); }

  IsLeapYear()
  {
    // CREDIT: https://stackoverflow.com/a/26426761, thank you!
    const year = this.getFullYear();

    if ((year & 3) !== 0) return false;
    else return ((year % 100) !== 0 || (year % 400) === 0);
  }

  Clone(){ return new DateTime(this); }

  *ForDays(days)
  {
    let temp = new DateTime(this);
    for (let i = 0; i < days; i++)
    {
      yield temp;
      temp.AddDays(1);
    }
  }

  *ForWeeks(weeks)
  {
    let temp = new DateTime(this);
    for (let i = 0; i < weeks; i++)
    {
      yield temp;
      temp.AddDays(7);
    }
  }

  MinutePart()
  {
    const minutes = this.GetMinute();

    if (minutes > 9) return minutes.toString();
    else return `0${minutes}`;
  }

  Hour24Part(){ return `${this.GetHour()}:${this.MinutePart()}`; }
  // Hour12Part(){ return `${this.GetHour()}:${this.MinutePart()}`; }

  Hour12Part()
  {
    const hours = this.GetHour();

    if (hours > 12) return `${hours - 12}`;
    else return hours.toString();
  }

  MeridiemPart()
  {
    return this.GetHour() >= 11 ? "pm" : "am";
  }

  OrdinalDatePart(){ return OrdinalDatePart(this); }

  _TwoDigit(num)
  {
    if (num > 9) return num.toString();
    else return "0" + num;
  }

  _Convert(part)
  {
    switch (parts[i])
    {
      case "d": return (this.GetDay() + 1).toString();
      case "dd":
      {
        const days = this.GetDay() + 1;
        if (days >= 10) return days.toString();
        else return "0" + days;
      }
      case "ddd": return this.GetDayNameShort();
      case "dddd": return this.GetDayName();

      case "h":
      {
        const hours = this.GetHour();
        if (hours > 12) return (hours - 12).toString();
        else return hours.toString();
      }
      case "hh":
      {
        const hours = this.GetHour();
        if (hours > 12) hours -= 12;

        return this._TwoDigit(hours);
      }
      case "H": return (this.GetHour() + 1).toString();
      case "HH": return this._TwoDigit(this.GetHour());

      case "m": return this.GetMinute().toString();
      case "mm": return this._TwoDigit(this.GetMinute());

      case "M": return this.GetMonth().toString();
      case "MM": return this._TwoDigit(this.GetMonth());
      case "MMM": return this.GetMonthNameShort();
      case "MMM": return this.GetMonthName();

      case "s": return this.GetSecond().ToString();
      case "ss": return this._TwoDigit(this.GetSecond());

      case "t": return this.GetHour() >= 12 ? "P" : "A";
      case "tt": return this.GetHour() >= 12 ? "PM" : "AM";

      // TODO: This is silly and inneficient, fix it sometime
      case "y": return Number((this.GetYear()).toString().slice(2)).toString();
      case "yy": return (this.GetYear()).toString().slice(2);
      // case "yyy": return this.GetMonthNameShort();
      case "yyyy": return this.GetYear().toString();

      default:
      {
      }
    }
  }

  Format(...parts)
  {
    let result = "";
    for (let i = 0; i < parts.length; i++)
    {
      result += this._Convert(parts[i]);
    }

    return result;
  }

  FormatTime()
  {
    return `${this.Hour12Part()}:${this.MinutePart()} ${this.MeridiemPart()}`;
  }

  FormatDay()
  {
    const days = this.GetHour();

    return ``;
  }

  FormatRelativeDay()
  {
    const temp = new DateTime(this);
    temp.Subtract(DateTime.Now());

    if (0 >= temp.GetDay()) return "Today";
    else if (1 >= temp.GetDay()) return "Tomorrow";

    return ``;
  }

  DaysBetween(date)
  {
    const difference = (this.Now() - date.Now());
    return Math.round(difference / DateTime.ONE_DAY_MS);
  }

  FormatRelativeDay()
  {
    return `${this.GetDayName()}, ${this.GetMonthNameShort()} ${this.OrdinalDatePart()}`;
  }

  FormatDay()
  {
    return `${this.GetDayName()}, ${this.GetMonthNameShort()} ${this.OrdinalDatePart()}`;
  }

  FormatTimeSince(since){ return FormatTimeSince(since); }

  Format(){ return new DateTimeFormatter(this); }
}
