function RenderError(error)
{
  return `<div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <div class="card">
        <div class="card-content">
          <div class="content is-medium">
            <p class="title">
              ${error.constructor.name || "Error"}
            </p>

            <p class="subtitle">
              Something went wrong while trying to load the program!
            </p>

            <p>
              <code>
                ${error.message.trim()}
              </code>
            </p>

            <p>
              <pre>
                ${error.stack.trim()}
              </pre>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function Handler(event)
{
  switch (event.message)
  {
    // It seems these "errors" are harmless and IDK why they even exist at all
    // See: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    // See: https://stackoverflow.com/questions/64238740/how-to-ignore-the-resizeobserver-loop-limit-exceeded-in-testcafe
    case "ResizeObserver loop completed with undelivered notifications.":
    case "ResizeObserver loop limit exceeded":
    {
      return;
    }
  }

  // console.log("~~ERROR", event);
  // console.error();
  const div = window.document.createElement("div");

  let error = event.error ?? new Error(event.message);

  div.innerHTML = RenderError(error);

  window.document.body.appendChild(div);
  // window.document.body.innerHTML = RenderError(event.error);
}

window.addEventListener("error", Handler);

// window.addEventListener("DOMContentLoaded", event =>
// {
//   console.log("Unsubscribing error handler");
//   window.removeEventListener("error", Handler);
// });

// window.onerror = event =>
// {
//   console.log("~~ERROR", event);
//   const div = window.document.createElement("div");
//   div.innerHTML = RenderError(event.error);
//
//   window.document.body.appendChild(div);
//   // window.document.body.innerHTML = RenderError(event.error);
// };
