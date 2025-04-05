import GreenlockExpress from "/js/External/GreenlockExpress.js?static=true";

let certificate;
export default function({
  staging,
  package_root,
  maintainer_email,
  config_dir,
  cluster,
  https_server,
  http_server,
  handler,
})
{
  // Only create the certificate once
  if (!certificate)
  {
    GreenlockExpress
    .init({
      staging,
      packageRoot: package_root,
      maintainerEmail: maintainer_email,
      configDir: config_dir,

      // whether or not to run at cloudscale
      cluster,
    })
    .ready(glx =>
    {
      // Get the raw https server:
      https_server = glx.httpsServer(null, SecureHandler);
      https_server.listen(443, "0.0.0.0", () =>
      {
        console.log("Listening on", https_server.address());
      });

      // NOTE: You must ALSO listen on port 80 for ACME HTTP-01 Challenges
      // (the ACME and http->https middleware are loaded by glx.httpServer)
      http_server = glx.httpServer(null, Handler);
      http_server.listen(80, "0.0.0.0", () =>
      {
        console.log("Listening on", http_server.address());
      });
    });
  }

  return certificate;
}
