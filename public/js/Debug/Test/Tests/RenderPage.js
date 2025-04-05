import {Test} from "/js/Debug/Test.js";

export class RenderPage extends Test
{
  async RenderPage(url)
  {
    // console.log("Performing built in RenderPage test on", url);
    this.Expect(url).Named("url").ToBeValidString();

    await global.app.Go(url);
  }
}
