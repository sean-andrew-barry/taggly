export class RandomUtilities
{
  // The maximum is exclusive and the minimum is inclusive
  static RandomInt(min, max)
  {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
  }

  static RandomFloat(min, max)
  {
    return Math.random() * (max - min) + min;
  }
}
