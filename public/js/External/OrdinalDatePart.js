// NOTE: Taken from Randika Vishman's example at https://stackoverflow.com/a/33134344

export function OrdinalDatePart(self)
{
  const d = self.GetDay();
  if (d > 3 && d < 21)
  {
    return d + "th";
  }

  switch (d % 10)
  {
    case 1:  return d + "st";
    case 2:  return d + "nd";
    case 3:  return d + "rd";
    default: return d + "th";
  }
}
