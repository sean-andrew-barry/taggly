import {Await} from "/js/Loader/Await.js";
import {Expect} from "/js/Expect.js";

export class Test
{
  static Sync(...args)
  {
    for (const test of args)
    {
      try
      {
        // console.log("Testing", test);
        const expect = Expect.Test(test);
        test(expect);
      }
      catch (error)
      {
        console.error(error);
      }
    }
  }

  static async Async(...args)
  {
    await Await();
  
    for (const test of args)
    {
      try
      {
        // console.log("Testing", test);
        await test();
      }
      catch (error)
      {
        console.error(error);
      }
    }
  }
}