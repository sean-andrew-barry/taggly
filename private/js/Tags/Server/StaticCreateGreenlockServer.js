import Greenlock from "/js/External/Greenlock.js?static=true";
import GreenlockExpress from "/js/External/GreenlockExpress.js?static=true";

async function CreateGreenlock({
  root,
  dir = "./greenlock.d/config.json",
  author,
  name,
  version,
  agree_to_terms = true,
  email = "webhosting@example.com",
  domains = ["example.com", "www.example.com"],
})
{
  const greenlock = Greenlock.create({
    packageRoot: root,
    configDir: dir,
    packageAgent: name + "/" + version,
    maintainerEmail: pkg.author,
    staging: true,
    notify: (event, details) =>
    {
      if ("error" === event)
      {
        // `details` is an error object in this case
        console.error("Greenlock:", details);
      }
    }
  });

  const manager = await greenlock.manager.defaults({
    agreeToTerms: agree_to_terms,
    subscriberEmail: email,
  });

  await greenlock.add({
    subject: domains[0],
    altnames: domains,
  })
  .then(() =>
  {
    // saved config to db (or file system)
  });
}

async function CreateExpress({
  staging = true,
  root,
  dir = "./greenlock.d",
  agree_to_terms = true,
  email = "webhosting@example.com",
  domains = ["example.com", "www.example.com"],
  cluster = false,
  app,
  SecureHandler,
  Handler,
})
{
  const greenlock = Greenlock.create({
    packageRoot: root,
    configDir: dir,
    // packageAgent: name + "/" + version,
    maintainerEmail: email,
    staging: staging,
    cluster: cluster,
    notify: (event, details) =>
    {
      if ("error" === event)
      {
        // `details` is an error object in this case
        console.error("Greenlock:", details);
      }
      else
      {
        console.log("Greenlock notification", event, details);
      }
    }
  });

  // const greenlock = await GreenlockExpress.init({
  //   staging: staging,
  //   packageRoot: root,
  //   maintainerEmail: email,
  //   configDir: dir,
  //
  //   // whether or not to run at cloudscale
  //   cluster: cluster,
  // });

  greenlock.sites.add({
    subject: domains[0],
    altnames: domains,
  });

  // set a global subscriber account with the API
  greenlock.manager.defaults({
    subscriberEmail: email,
    agreeToTerms: agree_to_terms,
  });

  // greenlock.serve(app);

  return greenlock;

  // .ready(glx =>
  // {
  //   console.log("Greenlock ready:", glx);
  //
  //   // // Get the raw https server:
  //   // this.https_server = glx.httpsServer(null, SecureHandler);
  //   // this.https_server.listen(443, "0.0.0.0", () =>
  //   // {
  //   //   console.log("Listening on", this.https_server.address());
  //   // });
  //   //
  //   // // NOTE: You must ALSO listen on port 80 for ACME HTTP-01 Challenges
  //   // // (the ACME and http->https middleware are loaded by glx.httpServer)
  //   // this.http_server = glx.httpServer(null, Handler);
  //   // this.http_server.listen(80, "0.0.0.0", () =>
  //   // {
  //   //   console.log("Listening on", this.http_server.address());
  //   // });
  // });
}

let greenlock;
export default async function(options)
{
  return greenlock ??= await CreateExpress(options);
}
