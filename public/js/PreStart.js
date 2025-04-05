console.log("Hi from PreStart.js");

if ("serviceWorker" in navigator)
{
  window.addEventListener("load", function()
  {
    console.log("window load");
    navigator.serviceWorker.register("/service.js")
    .then(registration =>
    {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(err =>
    {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
else
{
  console.log("No serviceWorker available");
}
