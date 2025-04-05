import {Tag} from "/js/Tag.js";
import {Text} from "/js/Tags/Text.js";
import {Connect} from "/js/Event/Connect.js";

let FORMATTER;
if (globalThis.Intl && globalThis.Intl.NumberFormat)
{
  FORMATTER = new globalThis.Intl.NumberFormat();
}

export class Number extends Tag
{
  static GetLocalName(){ return "number"; }
  static GetMetaURL(){ return import.meta.url; }
  // static SetNodeName(name = "number"){ return super.SetNodeName(name); }
  static GetFormatter(){ return FORMATTER; }

  constructor(value)
  {
    super();
    if (typeof(value) === "number")
    {
      this.Value(value);
    }
  }

  Parse(parser)
  {
    const c = parser.Next();
    if (c !== "-" && !parser.IsDigit(c)) return false;

    const digits = [c];
    while (parser.IsParsing())
    {
      const c = parser.Current();
      if (c !== "." && !parser.IsDigit(c)) break;

      digits.push(c);
      parser.Next();
    }

    const value = Number(digits.join(""));
    if (Number.isNaN(value)) return false;

    this.Value(value);

    return true;
  }

  // Text(text)
  // {
  //   if (typeof(text) === "string")
  //   {
  //     text = new Text(text);
  //   }
  //
  //   return this.Clear().AppendChild(text);
  // }

  Text(text)
  {
    if (typeof(text) === "string")
    {
      text = new Text(text);
    }

    return this.Clear().AppendChild(text);
  }

  [Connect](event)
  {
    if (this.IsDisabled()) return; // Don't auto invoke
    if (this.HasChildren()) return;

    // console.log("Number Connect", this.GetValue());
    const text = this.Format();
    this.Text(text);
  }

  Format()
  {
    const value = this.GetValue();

    if (typeof(value) !== "number")
    {
      throw new Error(`The Number tag expected to have a number value, but got "${typeof(value)}"`);
    }

    if (this.HasAttribute("currency"))
    {
      throw new Error("Not implemented");
    }
    else if (this.HasAttribute("unit"))
    {
      throw new Error("Not implemented");
    }
    else if (this.HasAttribute("currency"))
    {
      throw new Error("Not implemented");
    }
    else if (this.HasAttribute("percent"))
    {
      throw new Error("Not implemented");
    }
    else if (FORMATTER)
    {
      return FORMATTER.format(value);
    }
    else
    {
      return value.toString();
    }
  }

  // ToPrettyHTML(indent = "")
  // {
  //   return indent + this.GetValue();
  // }

  Currency(currency){ return this.SetAttribute("currency", currency); }
  Decimal(decimal){ return this.SetAttribute("decimal", decimal); }
  Percent(percent){ return this.SetAttribute("percent", percent); }

  Unit(unit){ return this.SetAttribute("unit", unit); }
  AccelerationGForce(){ return this.Unit("acceleration-g-force"); }
  AccelerationMeterPerSquareSecond(){ return this.Unit("acceleration-meter-per-square-second"); }
  AngleArcMinute(){ return this.Unit("angle-arc-minute"); }
  AngleArcSecond(){ return this.Unit("angle-arc-second"); }
  AngleDegree(){ return this.Unit("angle-degree"); }
  AngleRadian(){ return this.Unit("angle-radian"); }
  AngleRevolution(){ return this.Unit("angle-revolution"); }
  AreaAcre(){ return this.Unit("area-acre"); }
  AreaHectare(){ return this.Unit("area-hectare"); }
  AreaSquareCentimeter(){ return this.Unit("area-square-centimeter"); }
  AreaSquareFoot(){ return this.Unit("area-square-foot"); }
  AreaSquareInch(){ return this.Unit("area-square-inch"); }
  AreaSquareKilometer(){ return this.Unit("area-square-kilometer"); }
  AreaSquareMeter(){ return this.Unit("area-square-meter"); }
  AreaSquareMile(){ return this.Unit("area-square-mile"); }
  AreaSquareYard(){ return this.Unit("area-square-yard"); }
  AreaDunam(){ return this.Unit("area-dunam"); }
  ConcentrKarat(){ return this.Unit("concentr-karat"); }
  ConcentrMilligramOfGlucosePerDeciliter(){ return this.Unit("concentr-milligram-ofglucose-per-deciliter"); }
  ConcentrMillimolePerLiter(){ return this.Unit("concentr-millimole-per-liter"); }
  ConcentrPercent(){ return this.Unit("concentr-percent"); }
  ConcentrPermille(){ return this.Unit("concentr-permille"); }
  ConcentrPermyriad(){ return this.Unit("concentr-permyriad"); }
  ConcentrPermillion(){ return this.Unit("concentr-permillion"); }
  ConcentrMole(){ return this.Unit("concentr-mole"); }
  ConcentrItem(){ return this.Unit("concentr-item"); }
  ConcentrPortion(){ return this.Unit("concentr-portion"); }
  ConcentrOfglucose(){ return this.Unit("concentr-ofglucose"); }
  ConsumptionLiterPer100Kilometer(){ return this.Unit("consumption-liter-per-100-kilometer"); }
  ConsumptionLiterPerKilometer(){ return this.Unit("consumption-liter-per-kilometer"); }
  ConsumptionMilePerGallon(){ return this.Unit("consumption-mile-per-gallon"); }
  ConsumptionMilePerGallonImperial(){ return this.Unit("consumption-mile-per-gallon-imperial"); }
  DigitalBit(){ return this.Unit("digital-bit"); }
  DigitalByte(){ return this.Unit("digital-byte"); }
  DigitalGigabit(){ return this.Unit("digital-gigabit"); }
  DigitalGigabyte(){ return this.Unit("digital-gigabyte"); }
  DigitalKilobit(){ return this.Unit("digital-kilobit"); }
  DigitalKilobyte(){ return this.Unit("digital-kilobyte"); }
  DigitalMegabit(){ return this.Unit("digital-megabit"); }
  DigitalMegabyte(){ return this.Unit("digital-megabyte"); }
  DigitalPetabyte(){ return this.Unit("digital-petabyte"); }
  DigitalTerabit(){ return this.Unit("digital-terabit"); }
  DigitalTerabyte(){ return this.Unit("digital-terabyte"); }
  DurationCentury(){ return this.Unit("duration-century"); }
  DurationDecade(){ return this.Unit("duration-decade"); }
  DurationDay(){ return this.Unit("duration-day"); }
  DurationDayPerson(){ return this.Unit("duration-day-person"); }
  DurationHour(){ return this.Unit("duration-hour"); }
  DurationMicrosecond(){ return this.Unit("duration-microsecond"); }
  DurationMillisecond(){ return this.Unit("duration-millisecond"); }
  DurationMinute(){ return this.Unit("duration-minute"); }
  DurationMonth(){ return this.Unit("duration-month"); }
  DurationMonthPerson(){ return this.Unit("duration-month-person"); }
  DurationNanosecond(){ return this.Unit("duration-nanosecond"); }
  DurationSecond(){ return this.Unit("duration-second"); }
  DurationWeek(){ return this.Unit("duration-week"); }
  DurationWeekPerson(){ return this.Unit("duration-week-person"); }
  DurationYear(){ return this.Unit("duration-year"); }
  DurationYearPerson(){ return this.Unit("duration-year-person"); }
  ElectricAmpere(){ return this.Unit("electric-ampere"); }
  ElectricMilliampere(){ return this.Unit("electric-milliampere"); }
  ElectricOhm(){ return this.Unit("electric-ohm"); }
  ElectricVolt(){ return this.Unit("electric-volt"); }
  EnergyCalorie(){ return this.Unit("energy-calorie"); }
  EnergyFoodcalorie(){ return this.Unit("energy-foodcalorie"); }
  EnergyJoule(){ return this.Unit("energy-joule"); }
  EnergyKilocalorie(){ return this.Unit("energy-kilocalorie"); }
  EnergyKilojoule(){ return this.Unit("energy-kilojoule"); }
  EnergyKilowattHour(){ return this.Unit("energy-kilowatt-hour"); }
  EnergyElectronvolt(){ return this.Unit("energy-electronvolt"); }
  EnergyThermUs(){ return this.Unit("energy-therm-us"); }
  EnergyBritishThermalUnit(){ return this.Unit("energy-british-thermal-unit"); }
  ForcePoundForce(){ return this.Unit("force-pound-force"); }
  ForceNewton(){ return this.Unit("force-newton"); }
  ForceKilowattHourPer100Kilometer(){ return this.Unit("force-kilowatt-hour-per-100-kilometer"); }
  FrequencyGigahertz(){ return this.Unit("frequency-gigahertz"); }
  FrequencyHertz(){ return this.Unit("frequency-hertz"); }
  FrequencyKilohertz(){ return this.Unit("frequency-kilohertz"); }
  FrequencyMegahertz(){ return this.Unit("frequency-megahertz"); }
  GraphicsDot(){ return this.Unit("graphics-dot"); }
  GraphicsDotPerCentimeter(){ return this.Unit("graphics-dot-per-centimeter"); }
  GraphicsDotPerInch(){ return this.Unit("graphics-dot-per-inch"); }
  GraphicsEm(){ return this.Unit("graphics-em"); }
  GraphicsMegapixel(){ return this.Unit("graphics-megapixel"); }
  GraphicsPixel(){ return this.Unit("graphics-pixel"); }
  GraphicsPixelPerCentimeter(){ return this.Unit("graphics-pixel-per-centimeter"); }
  GraphicsPixelPerInch(){ return this.Unit("graphics-pixel-per-inch"); }
  Length100Kilometer(){ return this.Unit("length-100-kilometer"); }
  LengthAstronomicalUnit(){ return this.Unit("length-astronomical-unit"); }
  LengthCentimeter(){ return this.Unit("length-centimeter"); }
  LengthDecimeter(){ return this.Unit("length-decimeter"); }
  LengthFathom(){ return this.Unit("length-fathom"); }
  LengthFoot(){ return this.Unit("length-foot"); }
  LengthFurlong(){ return this.Unit("length-furlong"); }
  LengthInch(){ return this.Unit("length-inch"); }
  LengthKilometer(){ return this.Unit("length-kilometer"); }
  LengthLightYear(){ return this.Unit("length-light-year"); }
  LengthMeter(){ return this.Unit("length-meter"); }
  LengthMicrometer(){ return this.Unit("length-micrometer"); }
  LengthMile(){ return this.Unit("length-mile"); }
  LengthMileScandinavian(){ return this.Unit("length-mile-scandinavian"); }
  LengthMillimeter(){ return this.Unit("length-millimeter"); }
  LengthNanometer(){ return this.Unit("length-nanometer"); }
  LengthNauticalMile(){ return this.Unit("length-nautical-mile"); }
  LengthParsec(){ return this.Unit("length-parsec"); }
  LengthPicometer(){ return this.Unit("length-picometer"); }
  LengthPoint(){ return this.Unit("length-point"); }
  LengthYard(){ return this.Unit("length-yard"); }
  LengthEarthRadius(){ return this.Unit("length-earth-radius"); }
  LengthSolarRadius(){ return this.Unit("length-solar-radius"); }
  LightCandela(){ return this.Unit("light-candela"); }
  LightLumen(){ return this.Unit("light-lumen"); }
  LightLux(){ return this.Unit("light-lux"); }
  LightSolarLuminosity(){ return this.Unit("light-solar-luminosity"); }
  MassCarat(){ return this.Unit("mass-carat"); }
  MassGrain(){ return this.Unit("mass-grain"); }
  MassGram(){ return this.Unit("mass-gram"); }
  MassKilogram(){ return this.Unit("mass-kilogram"); }
  MassMetricTon(){ return this.Unit("mass-metric-ton"); }
  MassMicrogram(){ return this.Unit("mass-microgram"); }
  MassMilligram(){ return this.Unit("mass-milligram"); }
  MassOunce(){ return this.Unit("mass-ounce"); }
  MassOunceTroy(){ return this.Unit("mass-ounce-troy"); }
  MassPound(){ return this.Unit("mass-pound"); }
  MassStone(){ return this.Unit("mass-stone"); }
  MassTon(){ return this.Unit("mass-ton"); }
  MassDalton(){ return this.Unit("mass-dalton"); }
  MassEarthMass(){ return this.Unit("mass-earth-mass"); }
  MassSolarMass(){ return this.Unit("mass-solar-mass"); }
  PowerGigawatt(){ return this.Unit("power-gigawatt"); }
  PowerHorsepower(){ return this.Unit("power-horsepower"); }
  PowerKilowatt(){ return this.Unit("power-kilowatt"); }
  PowerMegawatt(){ return this.Unit("power-megawatt"); }
  PowerMilliwatt(){ return this.Unit("power-milliwatt"); }
  PowerWatt(){ return this.Unit("power-watt"); }
  PressureAtmosphere(){ return this.Unit("pressure-atmosphere"); }
  PressureHectopascal(){ return this.Unit("pressure-hectopascal"); }
  PressureInchOfhg(){ return this.Unit("pressure-inch-ofhg"); }
  PressureBar(){ return this.Unit("pressure-bar"); }
  PressureMillibar(){ return this.Unit("pressure-millibar"); }
  PressureMillimeterOfhg(){ return this.Unit("pressure-millimeter-ofhg"); }
  PressurePoundForcePerSquareInch(){ return this.Unit("pressure-pound-force-per-square-inch"); }
  PressurePascal(){ return this.Unit("pressure-pascal"); }
  PressureKilopascal(){ return this.Unit("pressure-kilopascal"); }
  PressureMegapascal(){ return this.Unit("pressure-megapascal"); }
  PressureOfhg(){ return this.Unit("pressure-ofhg"); }
  SpeedKilometerPerHour(){ return this.Unit("speed-kilometer-per-hour"); }
  SpeedKnot(){ return this.Unit("speed-knot"); }
  SpeedMeterPerSecond(){ return this.Unit("speed-meter-per-second"); }
  SpeedMilePerHour(){ return this.Unit("speed-mile-per-hour"); }
  TemperatureCelsius(){ return this.Unit("temperature-celsius"); }
  TemperatureFahrenheit(){ return this.Unit("temperature-fahrenheit"); }
  TemperatureGeneric(){ return this.Unit("temperature-generic"); }
  TemperatureKelvin(){ return this.Unit("temperature-kelvin"); }
  TorquePoundForceFoot(){ return this.Unit("torque-pound-force-foot"); }
  TorqueNewtonMeter(){ return this.Unit("torque-newton-meter"); }
  VolumeAcreFoot(){ return this.Unit("volume-acre-foot"); }
  VolumeBushel(){ return this.Unit("volume-bushel"); }
  VolumeCentiliter(){ return this.Unit("volume-centiliter"); }
  VolumeCubicCentimeter(){ return this.Unit("volume-cubic-centimeter"); }
  VolumeCubicFoot(){ return this.Unit("volume-cubic-foot"); }
  VolumeCubicInch(){ return this.Unit("volume-cubic-inch"); }
  VolumeCubicKilometer(){ return this.Unit("volume-cubic-kilometer"); }
  VolumeCubicMeter(){ return this.Unit("volume-cubic-meter"); }
  VolumeCubicMile(){ return this.Unit("volume-cubic-mile"); }
  VolumeCubicYard(){ return this.Unit("volume-cubic-yard"); }
  VolumeCup(){ return this.Unit("volume-cup"); }
  VolumeCupMetric(){ return this.Unit("volume-cup-metric"); }
  VolumeDeciliter(){ return this.Unit("volume-deciliter"); }
  VolumeDessertSpoon(){ return this.Unit("volume-dessert-spoon"); }
  VolumeDessertSpoonImperial(){ return this.Unit("volume-dessert-spoon-imperial"); }
  VolumeDrop(){ return this.Unit("volume-drop"); }
  VolumeDram(){ return this.Unit("volume-dram"); }
  VolumeJigger(){ return this.Unit("volume-jigger"); }
  VolumePinch(){ return this.Unit("volume-pinch"); }
  VolumeQuartImperial(){ return this.Unit("volume-quart-imperial"); }
  VolumeFluidOunce(){ return this.Unit("volume-fluid-ounce"); }
  VolumeFluidOunceImperial(){ return this.Unit("volume-fluid-ounce-imperial"); }
  VolumeGallon(){ return this.Unit("volume-gallon"); }
  VolumeGallonImperial(){ return this.Unit("volume-gallon-imperial"); }
  VolumeHectoliter(){ return this.Unit("volume-hectoliter"); }
  VolumeLiter(){ return this.Unit("volume-liter"); }
  VolumeMegaliter(){ return this.Unit("volume-megaliter"); }
  VolumeMilliliter(){ return this.Unit("volume-milliliter"); }
  VolumePint(){ return this.Unit("volume-pint"); }
  VolumePintMetric(){ return this.Unit("volume-pint-metric"); }
  VolumeQuart(){ return this.Unit("volume-quart"); }
  VolumeTablespoon(){ return this.Unit("volume-tablespoon"); }
  VolumeTeaspoon(){ return this.Unit("volume-teaspoon"); }
  VolumeBarrel(){ return this.Unit("volume-barrel"); }

  Deconvert(){ return this.value; }

  toJSON()
  {
    return [
      "number",
      [this.GetValue()],
    ];
  }
}
