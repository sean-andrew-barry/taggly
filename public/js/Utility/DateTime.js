import {GetDayOfYear} from "/js/External/GetDayOfYear.js";
import {IsLeapYear} from "/js/External/IsLeapYear.js";
import {DateTimeFormatter} from "/js/Utility/DateTimeFormatter.js";

export class DateTime
{
  static Now(){ return new DateTime(new Date()); }

  static GetMinuteMS(){ return DateTime.ONE_MINUTE_MS; }
  static GetHourMS  (){ return DateTime.ONE_HOUR_MS; }
  static GetDayMS   (){ return DateTime.ONE_DAY_MS; }

  static GetMonth     (){ return DateTime.MONTHS; }
  static GetMonthsShort(){ return DateTime.MONTHS_SHORT; }
  static GetDays       (){ return DateTime.DAYS; }
  static GetDaysShort  (){ return DateTime.DAYS_SHORT; }

  static GetMonthName     (i){ return DateTime.MONTHS[i]; }
  static GetMonthNameShort(i){ return DateTime.MONTHS_SHORT[i]; }
  static GetDayName       (i){ return DateTime.DAYS[i]; }
  static GetDayNameShort  (i){ return DateTime.DAYS_SHORT[i]; }

  static GetMonthLength(year, month)
  {
    return new Date(year, month, 0).getDate() + 1;
  }

  constructor(year, month, day)
  {
    switch (typeof(year))
    {
      case "string":
      {
        this.date = new Date(year);
        break;
      }
      case "number":
      {
        if (typeof(month) === "number" && typeof(day) === "number")
        {
          this.date = new Date(year, month, day);
        }
        else
        {
          // It should be a time in milliseconds
          this.date = new Date(year);
        }

        break;
      }
      case "object":
      {
        if (year === null) this.date = new Date();
        else if (year instanceof DateTime) this.date = new Date(year.date.getTime());
        else if (year instanceof Date) this.date = new Date(year.getTime());
        else throw new Error(`Unknown date object ${year}`);

        break;
      }
      case "undefined":
      {
        this.date = new Date();
        break;
      }
      default:
      {
        throw new Error(`Unknown DateTime constructor type: "${typeof(year)}"`);
      }
    }
  }

  ToStartOfDayUTC(){ this.date.setUTCHours(0, 0, 0, 0); return this; }
  ToStartOfDay   (){ this.date.setHours   (0, 0, 0, 0); return this; }

  Add     (date){ this.date = new Date(this.date + date.date); return this; }
  Subtract(date){ this.date = new Date(this.date - date.date); return this; }

  AddYears       (v){ this.date.setUTCFullYear    (this.date.getUTCFullYear    () + v); return this; }
  AddMonths      (v){ this.date.setUTCMonth       (this.date.getUTCMonth       () + v); return this; }
  AddDays        (v){ this.date.setUTCDate        (this.date.getUTCDate        () + v); return this; }
  AddHours       (v){ this.date.setUTCHours       (this.date.getUTCHours       () + v); return this; }
  AddMinutes     (v){ this.date.setUTCMinutes     (this.date.getUTCMinutes     () + v); return this; }
  AddSeconds     (v){ this.date.setUTCSeconds     (this.date.getUTCSeconds     () + v); return this; }
  AddMilliseconds(v){ this.date.setUTCMilliseconds(this.date.getUTCMilliseconds() + v); return this; }

  SubtractYears       (v){ this.date.setUTCFullYear    (this.date.getUTCFullYear    () - v); return this; }
  SubtractMonths      (v){ this.date.setUTCMonth       (this.date.getUTCMonth       () - v); return this; }
  SubtractDays        (v){ this.date.setUTCDate        (this.date.getUTCDate        () - v); return this; }
  SubtractHours       (v){ this.date.setUTCHours       (this.date.getUTCHours       () - v); return this; }
  SubtractMinutes     (v){ this.date.setUTCMinutes     (this.date.getUTCMinutes     () - v); return this; }
  SubtractSeconds     (v){ this.date.setUTCSeconds     (this.date.getUTCSeconds     () - v); return this; }
  SubtractMilliseconds(v){ this.date.setUTCMilliseconds(this.date.getUTCMilliseconds() - v); return this; }

  SetTime       (v){ this.date.setTime        (v); return this; }
  SetYear       (v){ this.date.setFullYear    (v); return this; }
  SetMonth      (v){ this.date.setMonth       (v); return this; }
  SetDay        (v){ this.date.setDate        (v); return this; }
  SetHour       (v){ this.date.setHours       (v); return this; }
  SetMinute     (v){ this.date.setMinutes     (v); return this; }
  SetSecond     (v){ this.date.setSeconds     (v); return this; }
  SetMillisecond(v){ this.date.setMilliseconds(v); return this; }

  SetYearUTC       (v){ this.date.setUTCFullYear    (v); return this; }
  SetMonthUTC      (v){ this.date.setUTCMonth       (v); return this; }
  SetDayUTC        (v){ this.date.setUTCDate        (v); return this; }
  SetHourUTC       (v){ this.date.setUTCHours       (v); return this; }
  SetMinuteUTC     (v){ this.date.setUTCMinutes     (v); return this; }
  SetSecondUTC     (v){ this.date.setUTCSeconds     (v); return this; }
  SetMillisecondUTC(v){ this.date.setUTCMilliseconds(v); return this; }

  GetMonthName     (){ return DateTime.MONTHS[this.date.getMonth()]; }
  GetMonthNameShort(){ return DateTime.MONTHS_SHORT[this.date.getMonth()]; }
  GetDayName       (){ return DateTime.DAYS[this.date.getDay()]; }
  GetDayNameShort  (){ return DateTime.DAYS_SHORT[this.date.getDay()]; }

  GetDayOfYear(){ return GetDayOfYear(this); }

  GetMonthLength(year, month)
  {
    return new Date(year || this.GetYear(), month || this.GetMonth(), 0).getDate() + 1;
  }

  GetTime(){ return this.date.getTime(); }

  GetYearUTC       (){ return this.date.getUTCFullYear    (); }
  GetMonthUTC      (){ return this.date.getUTCMonth       (); }
  GetDayUTC        (){ return this.date.getUTCDate        (); }
  GetHourUTC       (){ return this.date.getUTCHours       (); }
  GetMinuteUTC     (){ return this.date.getUTCMinutes     (); }
  GetSecondUTC     (){ return this.date.getUTCSeconds     (); }
  GetMillisecondUTC(){ return this.date.getUTCMilliseconds(); }

  GetYear       (){ return this.date.getFullYear    (); }
  GetMonth      (){ return this.date.getMonth       (); }
  GetDay        (){ return this.date.getDate        (); }
  GetWeekday    (){ return this.date.getDay         (); }
  GetHour       (){ return this.date.getHours       (); }
  GetMinute     (){ return this.date.getMinutes     (); }
  GetSecond     (){ return this.date.getSeconds     (); }
  GetMillisecond(){ return this.date.getMilliseconds(); }
  GetMicrosecond(){ return Math.round(this.date.getMilliseconds() * 1000) / 1000; }
  GetNanosecond (){ return Math.round(this.date.getMilliseconds() * 1000000) / 1000000; }

  h24(h){ return h > 12 ? h - 12 : h; }

  GetHourUTC12(){ return this.h24(this.GetHourUTC()); }
  GetHourUTC24(){ return this.GetHourUTC(); }
  GetHour12   (){ return this.h24(this.GetHour()); }
  GetHour24   (){ return this.GetHour(); }

  GetTimeZone()
  {
    const now = this.date.toString();
    return now.replace(/.*[(](.*)[)].*/, "$1"); // Extracts the content between parenthesis
  }

  GetTimeZoneOffset(){ return -(this.date.getTimezoneOffset() / 60); }

  IsLeapYear(){ return IsLeapYear(this.date); }

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

  OrdinalDatePart()
  {
    // NOTE: Taken from Randika Vishman's example at https://stackoverflow.com/a/33134344

    const d = this.GetDay();
    if (d > 3 && d < 21) return d + "th";
    switch (d % 10)
    {
      case 1:  return d + "st";
      case 2:  return d + "nd";
      case 3:  return d + "rd";
      default: return d + "th";
    }
  }

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

  toString(){ return this.date.toString(); }

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

  FormatTimeSince(since = Date.now())
  {
    // CREDIT: This function is a slightly modified version of what rob wrote at https://stackoverflow.com/a/23259289. Thanks!
    const seconds = Math.floor((since - this.GetTime()) / 1000);

    let type;
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
    {
      type = "year";
    }
    else
    {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1)
      {
        type = "month";
      }
      else
      {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1)
        {
          type = "day";
        }
        else
        {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1)
          {
            type = "hour";
          }
          else
          {
            interval = Math.floor(seconds / 60);
            if (interval >= 1)
            {
              type = "minute";
            }
            else
            {
              interval = seconds;
              type = "second";
            }
          }
        }
      }
    }

    if ((interval > 1) || (interval === 0))
    {
      return `${interval} ${type}s ago`;
    }
    else
    {
      return `${interval} ${type} ago`;
    }

    // return `${interval} ${type}${(interval > 1 || interval === 0) ? "s ago" : " ago"}`;
  }

  Format(){ return new DateTimeFormatter(this); }

  ToLocaleString(){ return this.date.toLocaleString(); }
}

DateTime.MONTHS = [
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

DateTime.MONTHS_SHORT = [
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

DateTime.DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

DateTime.DAYS_SHORT = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

DateTime.ONE_MINUTE_MS = 60 * 1000;
DateTime.ONE_HOUR_MS = 60 * DateTime.ONE_MINUTE_MS;
DateTime.ONE_DAY_MS = 24 * DateTime.ONE_HOUR_MS;

// Used in DayOfYear
DateTime.DAY_COUNT = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
