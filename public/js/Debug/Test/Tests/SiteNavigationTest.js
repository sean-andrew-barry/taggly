import {Test} from "/js/Debug/Test.js";

export class SiteNavigationTest extends Test
{
  async Initialize()
  {
    this.urls = new Set();
  }

  async TestPage(url = "/", base = window.location.origin)
  {
    url = new URL(url, base); // Do this to normalize the urls

    // Check for external links, as we don't want to test those
    if (url.origin !== window.location.origin)
    {
      this.urls.add(url.href);
    }

    if (this.urls.has(url.href)) return;
    // console.log("Performing built in RenderPage test on", url);

    // console.info("Performing SiteNavigationTest from", url.href);

    this.urls.add(url.href);

    const page = await global.app.Go(url.href);
    // console.info(page);

    const links = page.QueryAll("[href]");
    // console.info(links);

    for (let i = 0; i < links.length; i++)
    {
      const link = links[i];
      const href = link.GetAttribute("href");

      await this.TestPage(href, base);
    }
  }
}
