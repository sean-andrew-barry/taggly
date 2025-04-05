"use strict";

function RegisterServiceWorker()
{
  if ("serviceWorker" in navigator)
  {
    window.addEventListener("load", event =>
    {
      navigator.serviceWorker.register("/ServiceWorker.js?circular=true")
      .then(reg =>
      {
        console.log("Service worker registered.", reg);
      })
      .catch(error =>
      {
        console.error("Service worker error...", error);
      });
    });
  }
}

function RegisterInstaller()
{
  window.addEventListener("beforeinstallprompt", event =>
  {
    console.log("beforeinstallprompt", event);
  });

  window.addEventListener("appinstalled", event =>
  {
    console.log("appinstalled", event);
  });
}

function Start()
{
  const url = new URL(document.currentScript.src);
  const params = url.searchParams;

  // 127.0.0.1
  // 0.0.0.0

  // RegisterInstaller();
  // RegisterServiceWorker();

  if (params.has("version"))
  {
    const version = params.get("version").replace(/.*?\?([\d+\.]+)/, "$1");
    const parts = version.split(".").map(part => Number(part));

    window.GetVersion = function(){ return parts; }
  }
  else
  {
    window.GetVersion = function(){ return [0, 0, 0]; }
  }

  if (!params.has("name"))
  {
    if ((document.location.hostname.endsWith("localhost")) && params.has("dev"))
    {
      params.set("name", params.get("dev"));
    }
    else if (params.has("release"))
    {
      params.set("name", params.get("release"));
    }
    else
    {
      params.set("name", "Main");
    }
  }

  url.pathname = "/js/" + params.get("name") + ".js";
  params.delete("dev");
  params.delete("release");
  params.delete("name");

  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", url.href);
  document.body.appendChild(script);

  const nomod = document.createElement("script");
  nomod.setAttribute("nomodule", "");
  nomod.setAttribute("src", url.href);
  document.body.appendChild(nomod);
}

Start();
