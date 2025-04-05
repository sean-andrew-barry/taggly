import "/flag#static";

// CREDIT: https://stackoverflow.com/a/26426761, thank you!

export function GetDayOfYear(self)
{
  const month = self.getMonth();
  const date = self.getDate();
  let day = DAY_COUNT[month] + date;

  if (month > 1 && self.IsLeapYear()) day++;

  return day;
}
