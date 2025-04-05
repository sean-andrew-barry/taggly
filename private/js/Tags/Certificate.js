import {Tag} from "/js/Tag.js";
import {URL} from "/js/URL.js";

export class Certificate extends Tag
{
  IsLocal(){ return true; }

  async CreateCertificate()
  {
    URL.Post({
      apiVersion: "cert-manager.io/v1",
      kind: "ClusterIssuer",
      metadata: {
        name: "letsencrypt-staging",
      },
      spec: {
        acme: {
          email: "user@example.com",
          server: "https://acme-staging-v02.api.letsencrypt.org/directory",
          privateKeySecretRef: {
            name: "example-issuer-account-key",
          },
          solvers: {
            http01: {
              ingress: {
                class: "nginx",
              },
            },
          },
        },
      },
    });
  }

  GetCertificate(){ return this.certificate ??= this.CreateCertificate(); }
}
