import "/flag#static";

// CREDIT: https://stackoverflow.com/a/26426761
// Thank you!

export function IsLeapYear(date)
{
  const year = date.getFullYear();

  if ((year & 3) !== 0) return false;
  else return ((year % 100) !== 0 || (year % 400) === 0);
}
