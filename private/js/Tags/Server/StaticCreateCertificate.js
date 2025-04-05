import "/flag#static";
import {forge} from "/js/External/NodeForge.js";
import {console} from "/js/Console.js";

// console.log("STATIC LOAD", import.meta.url);

let certificate;
export function StaticCreateCertificate(attrs, extensions)
{
  // Only create the certificate once
  if (!certificate)
  {
    const start = performance.now();

    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;

    // NOTE: serialNumber is the hex encoded value of an ASN.1 INTEGER.
    // Conforming CAs should ensure serialNumber is:
    // - no more than 20 octets
    // - non-negative (prefix a '00' if your value starts with a '1' bit)
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    cert.setExtensions(extensions);

    cert.sign(keys.privateKey);

    certificate = {
      key: forge.pki.privateKeyToPem(keys.privateKey),
      cert: forge.pki.certificateToPem(cert),
    };

    const end = performance.now();
    console.log(`${console.YellowBright("SSL certificate")} generated after`, Math.floor(end - start), "ms");
  }

  return certificate;
}
