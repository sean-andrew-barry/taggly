export async function ExecuteWithLock(array, index, callback)
{
  // Read the end value non-atomically, if it's an old value, compareExchange will return the new version
  let current = array[index];
  while (true)
  {
    const positive = current & 0x7FFFFFFF; // Clear the sign, making it positive
    const negative = current | 0x80000000; // Set the sign, making it negative

    // If the atomic value is positive, it was unlocked, so we lock it
    current = Atomics.compareExchange(array, index, positive, negative);
    if (current === positive)
    {
      break;
    }
    else
    {
      const { async, value } = Atomics.waitAsync(array, index, current);
      if (async) await value;
    }
  }

  // Make the reference positive again to pass to the handler and to write back atomically
  current = current & 0x7FFFFFFF;

  try
  {
    // We now own the lock; as long as it isn't bypassed, we can safely change state
    return await callback(current);
  }
  catch (error)
  {
    throw error;
  }
  finally
  {
    // Now, release the lock by writing the positive end point again
    Atomics.store(array, index, current);
    Atomics.notify(array, index);
  }
}