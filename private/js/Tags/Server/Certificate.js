import {Certificate as Base} from "/js/Tags/Server/Certificate.js?after=/taggly/private/";
import {ACME} from "/js/External/ACME.js";
import {Secret} from "/js/Tags/Model/Secret.js";

export class Certificate extends Base
{
  GetAccount(){ return; }

  GetDirectoryURL(){ return "https://acme-staging-v02.api.letsencrypt.org/directory"; }

  GetMaintainerEmail()
  {
    throw new Error(`The "GetMaintainerEmail" function must be overridden. This should be the email address of the author of the code, who will receive critical bug and security notices.`);
  }

  GetSubscriberEmail()
  {
    throw new Error(`The "GetSubscriberEmail" function must be overridden. This should be the email address of the service provider who will receive renewal failure notices and manage the ACME account.`);
  }

  GetPackageAgent(){ return; }
  GetSkipChallengeTests(){ return; }
  GetHostName(){ return; }
  GetAgreeToTerms(){ return true; }
  GetNotifyHandler(){ return this.OnNotify.bind(this); }
  GetCustomerEmail(){ return undefined; } // Do not use according to ACME docs

  GetValidator()
  {
    throw new Error(`The "GetValidator" function must be overridden. This should return a new instance of an object that will perform the domain validation. Default validators are found in /js/Tags/Server/Certificate/...`);
  }

  async GetChallenges()
  {
    const validator = await this.GetValidator();

    return {
      [await validator.GetProtocol()]: validator,
    };
  }

  constructor(...args)
  {
    super(...args);
    console.log("~~Certificate tag");
  }

  //---------------------------------
  // Notification callbacks
  //---------------------------------
  OnCertificateOrder(){}
  OnChallengeSelect(){}
  OnChallengeStatus(){}
  OnChallengeRemove(){}
  OnCertificateStatus(){}
  OnWarning(){}
  OnError(){}

  OnNotify(event, ...args)
  {
    console.log("~OnNotify:", event, args);
    switch (event)
    {
      case "certificate_order": return this.OnCertificateOrder(...args);
      case "challenge_select": return this.OnChallengeSelect(...args);
      case "challenge_status": return this.OnChallengeStatus(...args);
      case "challenge_remove": return this.OnChallengeRemove(...args);
      case "certificate_status": return this.OnCertificateStatus(...args);
      case "warning": return this.OnWarning(...args);
      case "error": return this.OnError(...args);
      default: throw new Error(`Unknown OnNotify event of "${event}"`);
    }
  }

  async CreateACME()
  {
    const maintainer_email = await this.GetMaintainerEmail();
    const package_agent = await this.GetPackageAgent();
    const notify_handler = await this.GetNotifyHandler();

    const acme = ACME.create({
      maintainerEmail: maintainer_email,
      packageAgent: package_agent,
      notify: notify_handler,
    });

    const directory_url = await this.GetDirectoryURL();
    acme.init(directory_url);

    return acme;
  }

  async CreateAccount()
  {
    const acme = await this.GetACME();

    const subscriber_email = await this.GetSubscriberEmail();
    const agree_to_terms = await this.GetAgreeToTerms();
    const account_key = await this.GetAccountKey();

    return acme.accounts.create({
      subscriberEmail: subscriber_email,
      agreeToTerms: agree_to_terms,
      accountKey: account_key,
    });
  }

  async CreateCertificates()
  {
    const acme = await this.GetACME();

    const customer_email = await this.GetCustomerEmail();
    if (customer_email) this.ThrowCustomerEmailExists(customer_email);

    const account = await this.GetAccount();
    // if (!account) this.ThrowNoAccount();

    const account_key = await this.GetAccountKey();
    // if (!account_key) this.ThrowNoAccountKey();

    const csr = await this.GetCSR();
    const domains = await this.GetDomains();
    const challenges = await this.GetChallenges();

    return acme.certificates.create({
      customerEmail: customer_email, // Do not use
      account,
      accountKey: account_key,
      csr,
      domains,
      challenges,
    });
  }

  GetACME(){ return this.acme ??= this.CreateACME(); }
  GetAccount(){ return this.account ??= this.CreateAccount(); }
  GetCertificates(){ return this.certificates ??= this.CreateCertificates(); }

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

  async CreateRemoteCertificate()
  {
    const acme = await this.GetACME();

    const customer_email = await this.GetCustomerEmail();
    if (customer_email) this.ThrowCustomerEmailExists(customer_email);

    const account = await this.GetAccount();
    // if (!account) this.ThrowNoAccount();

    const account_key = await this.GetAccountKey();
    // if (!account_key) this.ThrowNoAccountKey();

    const csr = await this.GetCSR();
    const domains = await this.GetDomains();
    const challenges = await this.GetChallenges();

    return acme.certificates.create({
      customerEmail: customer_email, // Do not use
      account,
      accountKey: account_key,
      csr,
      domains,
      challenges,
    });
  }

  async CreateLocalCertificate()
  {
  }

  async CreateCertificate()
  {
    // If there is an enabled database, then try to load a certificate from it
    const db = await this.GetDocument().GetDatabase();
    if (db && await db.IsEnabled())
    {
      // Attempt to load a certificate from the database
      const rsa_private_key = await new Secret().Key("==", "rsa_private_key").Search();
      const ssl_certificate = await new Secret().Key("==", "ssl_certificate").Search();

      if (rsa_private_key && ssl_certificate)
      {
        const expiration = ssl_certificate.GetExpiration();
        if (expiration > Date.now())
        {
          return {
            key: rsa_private_key.GetValue(),
            cert: ssl_certificate.GetValue(),
            expiration: ssl_certificate.GetExpiration(),
          };
        }
      }
    }

    let certificate = await this.GenerateCertificate();

    const is_local = await this.IsLocal();
    if (is_local)
    {
      certificate = await this.CreateLocalCertificate();
    }
    else
    {
      certificate = await this.CreateRemoteCertificate();
    }

    // If there is an enabled database, store the certificate in it
    if (db && await db.IsEnabled())
    {
      await new Secret().Key("=", "rsa_private_key").Value("=", certificate.key).Insert();
      await new Secret().Key("=", "ssl_certificate").Value("=", certificate.cert).Insert();
    }
    else if (!is_local)
    {
      console.warn(`Generated a remote SSL certificate, but there is no database to store it in.`);
    }

    return certificate;
  }

  IsLocal(){ return true; }

  GetCertificate(){ return this.certificate ??= this.CreateCertificate(); }

  ThrowCustomerEmailExists(customer_email)
  {
    throw new Error(`Using the "customer_email" is not recommended by the ACME package documentation. I included it in my implementation for completeness, but unless you know what you're doing, I recommend you stick to the docs and do not use it. If you do know what you're doing and want to use it anyway, simply override this "ThrowCustomerEmailExists" function to stop this error from being thrown.`);
  }
}
