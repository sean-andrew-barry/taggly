import "/flag#static";

// CREDIT: This function is a slightly modified version of what rob wrote at https://stackoverflow.com/a/23259289. Thanks!

export function FormatTimeSince(since = Date.now())
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
