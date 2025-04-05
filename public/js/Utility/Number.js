const FORMATTER_CACHE = {};

export class NumberUtilities
{
  static GetFormatterCacheObject(){ return FORMATTER_CACHE; }
  
  static GetLocale(){ return undefined; }
  static GetLocaleMatcher(){ return "best fit"; }
  static UseGrouping(){ return undefined; }
  static GetMinimumIntegerDigits(){ return undefined; }
  static GetMinimumFractionDigits(){ return undefined; }
  static GetMaximumFractionDigits(){ return undefined; }
  static GetMinimumSignificantDigits(){ return undefined; }
  static GetMaximumSignificantDigits(){ return undefined; }

  static GetFormatter(key, {
    locale,
    compactDisplay,
    currency,
    currencyDisplay,
    currencySign,
    localeMatcher = this.GetLocaleMatcher(),
    notation,
    numberingSystem,
    signDisplay,
    style,
    unit,
    unitDisplay,
    useGrouping = this.UseGrouping(),
    minimumIntegerDigits = this.GetMinimumIntegerDigits(),
    minimumFractionDigits = this.GetMinimumFractionDigits(),
    maximumFractionDigits = this.GetMaximumFractionDigits(),
    minimumSignificantDigits = this.GetMinimumSignificantDigits(),
    maximumSignificantDigits = this.GetMaximumSignificantDigits(),
  })
  {
    if (FORMATTER_CACHE.hasOwnProperty(key))
    {
      return FORMATTER_CACHE[key];
    }
    else
    {
      return FORMATTER_CACHE[key] = new window.Intl.NumberFormat(locale, {
        compactDisplay,
        currency,
        currencyDisplay,
        currencySign,
        localeMatcher,
        notation,
        numberingSystem,
        signDisplay,
        style,
        unit,
        unitDisplay,
        useGrouping,
      });
    }
  }

  static GetUnitFormatter(key, unit, unitDisplay = "long")
  {
    return this[key] || this.GetFormatter(key, {
      style: "unit",
      unit,
      unitDisplay,
    });
  }

  static GetCurrencyFormatter(key, currency, currencyDisplay, currencySign = "accounting", signDisplay = "always")
  {
    return this[key] || this.GetFormatter(key, {
      style: "currency",
      currency,
      currencyDisplay,
      currencySign,
      signDisplay,
    });
  }

  static GetDecimalFormatter(key, notation, compactDisplay = "short")
  {
    return this[key] || this.GetFormatter(key, {
      style: "decimal",
      compactDisplay,
    });
  }

  static ToScientific(v){ return this.GetDecimalFormatter("ToScientific", "scientific").format(v); }
  static ToEngineering(v){ return this.GetDecimalFormatter("ToEngineering", "engineering").format(v); }
  static ToCompact(v){ return this.GetDecimalFormatter("ToCompact", "compact").format(v); }

  static ToAcre(v){ return this.GetUnitFormatter("ToAcre", "acre").format(v); }
  static ToBit(v){ return this.GetUnitFormatter("ToBit", "bit").format(v); }
  static ToByte(v){ return this.GetUnitFormatter("ToByte", "byte").format(v); }
  static ToCelsius(v){ return this.GetUnitFormatter("ToCelsius", "celsius").format(v); }
  static ToCentimeter(v){ return this.GetUnitFormatter("ToCentimeter", "centimeter").format(v); }
  static ToDay(v){ return this.GetUnitFormatter("ToDay", "day").format(v); }
  static ToDegree(v){ return this.GetUnitFormatter("ToDegree", "degree").format(v); }
  static ToFahrenheit(v){ return this.GetUnitFormatter("ToFahrenheit", "fahrenheit").format(v); }
  static ToFluidOunce(v){ return this.GetUnitFormatter("ToFluidOunce", "fluid-ounce").format(v); }
  static ToFoot(v){ return this.GetUnitFormatter("ToFoot", "foot").format(v); }
  static ToGigabit(v){ return this.GetUnitFormatter("ToGigabit", "gigabit").format(v); }
  static ToGigabyte(v){ return this.GetUnitFormatter("ToGigabyte", "gigabyte").format(v); }
  static ToGram(v){ return this.GetUnitFormatter("ToGram", "gram").format(v); }
  static ToHectare(v){ return this.GetUnitFormatter("ToHectare", "hectare").format(v); }
  static ToHour(v){ return this.GetUnitFormatter("ToHour", "hour").format(v); }
  static ToInch(v){ return this.GetUnitFormatter("ToInch", "inch").format(v); }
  static ToKilobit(v){ return this.GetUnitFormatter("ToKilobit", "kilobit").format(v); }
  static ToKilobyte(v){ return this.GetUnitFormatter("ToKilobyte", "kilobyte").format(v); }
  static ToKilogram(v){ return this.GetUnitFormatter("ToKilogram", "kilogram").format(v); }
  static ToKilometer(v){ return this.GetUnitFormatter("ToKilometer", "kilometer").format(v); }
  static ToLiter(v){ return this.GetUnitFormatter("ToLiter", "liter").format(v); }
  static ToMegabit(v){ return this.GetUnitFormatter("ToMegabit", "megabit").format(v); }
  static ToMegabyte(v){ return this.GetUnitFormatter("ToMegabyte", "megabyte").format(v); }
  static ToMeter(v){ return this.GetUnitFormatter("ToMeter", "meter").format(v); }
  static ToMile(v){ return this.GetUnitFormatter("ToMile", "mile").format(v); }
  static ToMileScandinavian(v){ return this.GetUnitFormatter("ToMileScandinavian", "mile-scandinavian").format(v); }
  static ToMilliliter(v){ return this.GetUnitFormatter("ToMilliliter", "milliliter").format(v); }
  static ToMillimeter(v){ return this.GetUnitFormatter("ToMillimeter", "millimeter").format(v); }
  static ToMillisecond(v){ return this.GetUnitFormatter("ToMillisecond", "millisecond").format(v); }
  static ToMinute(v){ return this.GetUnitFormatter("ToMinute", "minute").format(v); }
  static ToMonth(v){ return this.GetUnitFormatter("ToMonth", "month").format(v); }
  static ToOunce(v){ return this.GetUnitFormatter("ToOunce", "ounce").format(v); }
  static ToPercent(v){ return this.GetUnitFormatter("ToPercent", "percent").format(v); }
  static ToPetabyte(v){ return this.GetUnitFormatter("ToPetabyte", "petabyte").format(v); }
  static ToPound(v){ return this.GetUnitFormatter("ToPound", "pound").format(v); }
  static ToSecond(v){ return this.GetUnitFormatter("ToSecond", "second").format(v); }
  static ToStone(v){ return this.GetUnitFormatter("ToStone", "stone").format(v); }
  static ToTerabit(v){ return this.GetUnitFormatter("ToTerabit", "terabit").format(v); }
  static ToTerabyte(v){ return this.GetUnitFormatter("ToTerabyte", "terabyte").format(v); }
  static ToWeek(v){ return this.GetUnitFormatter("ToWeek", "week").format(v); }
  static ToYard(v){ return this.GetUnitFormatter("ToYard", "yard").format(v); }
  static ToYear(v){ return this.GetUnitFormatter("ToYear", "year").format(v); }

  static ToDecimal(value){ return new window.Intl.NumberFormat(undefined, { style: "decimal" }).format(value); }
  static ToPercent(value){ return new window.Intl.NumberFormat(undefined, { style: "percent" }).format(value); }
  static ToLiter(value){ return new window.Intl.NumberFormat(undefined, { style: "unit", unit: "liter", unitDisplay: "long" }).format(value); }
  static ToUSD(value)
  {
    return new window.Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      currencySign: "accounting",
    }).format(value);
  }

  static ToScientific(value)
  {
    return new window.Intl.NumberFormat(undefined, {
      notation: "scientific",
    }).format(value);
  }

  static ToEngineering(value)
  {
    return new window.Intl.NumberFormat(undefined, {
      notation: "engineering",
    }).format(value);
  }

  static ToCompact(value)
  {
    return new window.Intl.NumberFormat(undefined, {
      notation: "compact",
      compactDisplay: "long",
    }).format(value);
  }

  static ToCompactShort(value)
  {
    return new window.Intl.NumberFormat(undefined, {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  }

  static ToPercentZero(value)
  {
    return new window.Intl.NumberFormat(undefined, {
      style: "percent",
      signDisplay: "exceptZero",
    }).format(value);
  }
}
