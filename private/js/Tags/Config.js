import {Tag} from "/js/Tag.js";
import {Base} from "/js/Tags/Config/Base.js";
import {fileURLToPath} from "url";
import {dirname, resolve} from "path";
import {OS} from "/js/Tags/OS.js";
import {Database} from "/js/Tags/Database.js";
import {Server} from "/js/Tags/Server.js";
import {Mailer} from "/js/Tags/Mailer.js";
import {Webpack} from "/js/Tags/Webpack.js";
import {Environment} from "/js/Utility/Environment.js";

export class Config extends Base
{
  GetFileName(meta_url){ return fileURLToPath(meta_url); }
  GetDirName(file_name){ return dirname(filename); }

  IsDevelopment(){ throw new Error("Config.IsDevelopment must be overridden"); }
  async IsNotDevelopment(){ return !(await this.IsDevelopment()); }

  GetRootPath(){ throw new Error("Config.GetRootPath must be overridden"); }
  GetRootPath(){ return Environment.GetLoader().GetCWD(); }

  // GetDatabaseUsername(){ return undefined; }
  // GetDatabasePassword(){ return undefined; }
  // GetDatabaseName(){ throw new Error("Config.GetDatabaseName must be overridden"); }
  // GetDatabaseTimeout(){ return undefined; }
  GetDatabaseCacheKey(){ return "database.default_key"; }

  // TODO: Implement Seeder
  UseSeeder(){ return false; }
  GetSeederRoot(){ return "./Server/Seed"; }
  GetSeederPaths(){ throw new Error(`App.SeederPaths must be overridden if using a Seeder`); }

  UseWebSocketHotReload(){ return this.IsDevelopment(); }
  UseGeneratedCertificate(){ return this.IsDevelopment(); }
  UseGeneratedCertificate(){ return true; }

  // UseHTTP(){ return true; }
  // UseHTTPS(){ return true; }

  GetSocketCacheKey(){ return "socket.default_key"; }

  GetServerKey(){ return undefined; }
  GetServerCertificate(){ return undefined; }
  GetServerSecret(){ throw new Error(`Config.ServerSecret must be overridden`); }
  GetSessionMaxAge(){ return 1000 * 60 * 60 * 24 * 7; } // 1 week
  GetServerUseETag(){ return true; }
  GetServerCacheMaxAge(){ return 86400000; } // In milliseconds?
  GetServerIndexName(){ return "index.html"; }
  GetServerFileExtensions(){ return ["html"]; }
  GetServerUseCompression(){ return true; }
  GetServerUseProxy(){ return true; }
  GetServerUseCookieParser(){ return true; }
  GetServerMaxPayloadSize(){ return "10mb"; }
  GetServerUseHTTP2(){ return true; }
  GetServerUseHTTP2Workaround(){ return true; }
  GetServerCacheKey(){ return "server.default_key"; }

  GetCertificateStaging(){ return true; }
  GetCertificatePackageRoot(){ return process.cwd(); }
  GetCertificateMaintainerEmail(){ return "seanandrewbarry@protonmail.com"; }
  GetCertificateConfigDirectory(){ return "./greenlock.d"; }
  GetCertificateCluster(){ return false; }

  GetCertificateCommonName(){ return "example.org"; }
  GetCertificateCountryName(){ return "US"; }
  GetCertificateStateName(){ return "Virginia"; }
  GetCertificateLocalityName(){ return "Blacksburg"; }
  GetCertificateOrganizationName(){ return "Test"; }
  GetCertificateOrganizationShortName(){ return "Test"; }
  GetCertificateAttributes()
  {
    return [
      {
        name: "commonName",
        value: this.GetCertificateCommonName(),
      },
      {
        name: "countryName",
        value: this.GetCertificateCountryName(),
      },
      {
        shortName: "ST",
        value: this.GetCertificateStateName(),
      },
      {
        name: "localityName",
        value: this.GetCertificateLocalityName(),
      },
      {
        name: "organizationName",
        value: this.GetCertificateOrganizationName(),
      },
      {
        shortName: "OU",
        value: this.GetCertificateOrganizationShortName(),
      },
    ];
  }

  GetCertificateExtensions()
  {
    return [
      {
        name: "basicConstraints",
        cA: true,
      },
      {
        name: "keyUsage",
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: "extKeyUsage",
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true,
      },
      {
        name: "nsCertType",
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true,
      },
      {
        name: "subjectAltName",
        altNames: [
          {
            type: 6, // URI
            value: "http://example.org/webid#me"
          },
          {
            type: 7, // IP
            ip: "127.0.0.1",
          },
        ],
      },
      {
        name: "subjectKeyIdentifier",
      },
    ];
  }

  UseReloader(){ return true; }
  GetReloaderMaxHeapGrowthMB(){ return 100; }

  UseSeeder(){ return false; }

  UseWebpack(){ return true; }
  UseWebpack(){ return this.IsNotDevelopment(); }
  GetWebpackExtensions(){ return [".js"]; }
  // GetWebpackMode(){ return "development"; }

  async GetWebpackMode()
  {
    if (await this.IsDevelopment()) return "development";
    else return "production";
  }
  GetWebpackRoot(){ return resolve(this.GetRootPath(), "./public"); }
  GetWebpackEntrySpecifier(){ return "/js/Start.js"; }
  GetWebpackEntryFile(){ return "./js/Start.js"; }
  GetWebpackOutputPath(){ return "./js"; }
  GetWebpackOutputFileName(){ return "Compiled.js"; }
  GetWebpackUsePerformanceHints(){ return false; }
  GetWebpackKeepClassNames(){ return true; }
  GetWebpackKeepFunctionNames(){ return true; }
}
