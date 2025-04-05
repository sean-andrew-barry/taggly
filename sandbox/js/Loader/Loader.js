export class Loader
{
  constructor()
  {
    console.log("Constructing virtual loader");
  }

  GetWindowURL(){ return "https://localhost/"; }
  GetContentType(){ return "text/html"; }
  GetStorageQuota(){ return; }
  GetDevelopment(){ return false; }
  GetInstance(){ return 0; }
  GetImported(){ return 0; }
  GetVersion(){ return "1.0.0"; }
  GetVersionMajor(){ return; }
  GetVersionMinor(){ return; }
  GetVersionPatch(){ return; }
  GetDomains(){ return ["public", "private"]; }
  GetLoaderPath(){ return import.meta.url; }
  GetPreloaderURL(){ return; }

  Round(value, multiplier = 100)
  {
    return Math.floor(value * multiplier) / multiplier;
  }

  async Start()
  {
    console.log("Starting virtual loader");

    // return import("/js/Start.js")
    // .then(result =>
    // {
    //   console.log("Finished importing Start.js");
    // })
    // .catch(error =>
    // {
    //   console.error("Error importing Start.js", error);
    // });
  }
}
