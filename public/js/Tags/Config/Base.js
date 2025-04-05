import {Tag} from "/js/Tag.js";
import {Tests} from "/js/Tags/Tests.js";
import {Singleton} from "/js/Tags/Singleton.js";

export class Base extends Singleton
{
  static GetNodeName(){ return "config"; }

  Major(major){ return this.SetAttribute("major", major); }
  Minor(minor){ return this.SetAttribute("minor", minor); }
  Patch(patch){ return this.SetAttribute("patch", patch); }

  GetMajor(){ return this.GetAttributeNumber("major") || 0; }
  GetMinor(){ return this.GetAttributeNumber("minor") || 0; }
  GetPatch(){ return this.GetAttributeNumber("patch") || 0; }
  GetParts(){ return [this.GetMajor(), this.GetMinor(), this.GetPatch()]; }
  GetVersion(){ return `${this.GetMajor()}.${this.GetMinor()}.${this.GetPatch()}`; }

  IsFakeLoad(){ return false; }
  IsDevelopment(){ throw new Error(`Config must override IsDevelopment`); }

  UseOS(){ return true; }

  UseDatabase(){ return true; }
  GetDatabaseURL(){ return "mongodb://localhost:27017/"; }
  GetDatabaseUsername(){}
  GetDatabasePassword(){}
  GetDatabaseName(){}
  GetDatabaseTimeout(){}

  // Default to false, because Mailer setup has required parameters
  UseMailer        (){ return false; }
  GetMailerPort    (){ return 465; }
  GetMailerIsSecure(){ return true; }
  GetMailerHost    (){ throw new Error("A Mailer host is required"); }
  GetMailerUsername(){ throw new Error("A Mailer username is requried"); }
  GetMailerPassword(){ throw new Error("A Mailer password is requried"); }
  GetMailerCacheKey(){ return "mailer.default_key"; }

  UseServer(){ return true; }
  GetServerPort(){ return 443; }
  GetServerIsSecure(){ return true; }
  GetServerParseJSON(){ return true; }
  GetServerParseCookies(){ return false; }
  GetServerParseForm(){ return true; }
  GetServerProxy(){ return false; }
  GetServerKey(){ return undefined; }
  GetServerCertificate(){ return undefined; }
  GetServerSecret(){}
  GetSessionMaxAge(){}
  GetServerUseETag(){}
  GetServerCacheMaxAge(){}
  GetServerIndexName(){}
  GetServerFileExtensions(){}
  GetServerUseCompression(){}
  GetServerUseCookieParser(){}
  GetServerMaxPayloadSize(){}
  GetServerUseHTTP2(){ return false; }
  GetServerUseHTTP2Workaround(){ return true; }

  UseSocket(){ return true; }

  UseDynamicImporter(){ return true; }
  UseHistory(){ return true; }

  UseTests(){ return this.IsDevelopment(); }
  GetTestsDelay(){ return 50; }
  GetTestsPause(){ return this.GetTestsDelay(); }
  GetTestsUseInlineFrame(){ return true; }
  GetTestsMuteConsoleLog(){ return true; }
  GetTestsMuteConsoleWarn(){ return false; }
  GetTestsMuteConsoleError(){ return false; }
  UseCache(){ return true; }

  UseWebpack(){ return false; }
  GetWebpackExtensions(){ return [".js"]; }
  GetWebpackMode(){ return "development"; }
  GetWebpackRoot(){}
  GetWebpackEntrySpecifier(){ return "/js/Start.js"; }
  GetWebpackEntryFile(){ return "./js/Start.js"; }
  GetWebpackOutputPath(){ return "./js"; }
  GetWebpackOutputFileName(){ return "Compiled.js"; }
  GetWebpackUsePerformanceHints(){ return false; }
  GetWebpackKeepClassNames(){ return true; }
  GetWebpackKeepFunctionNames(){ return true; }

  // Render()
  // {
  //   // console.log("~~~~~~~Rendering Config~~~~~~~~~~~~~~");
  //   return super.Render();
  // }
}
