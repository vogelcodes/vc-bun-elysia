import { liveReloadScript } from "../dev";
import { type PropsWithChildren } from "../dev/jsx";

const safeScript =
  process.env.NODE_ENV === "development" ? liveReloadScript() : "";

export const BaseHtml = ({ children }: PropsWithChildren) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>VogelMKT</title>
      <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      <script>htmx.config.globalViewTransitions = true;</script>
      <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/loading-states.js"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
      <style>
        {`
          [data-loading] {
            display: none;
          }
        `}
      </style>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
      />
      <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
      <script type="text/hyperscript">
        {`
        def copySelectorToClipboard(selector)
          get the innerHTML of selector
          call navigator.clipboard.writeText(the result)
        end
      `}
      </script>
      <script>{safeScript}</script>
    </head>
    <body
      hx-boost="true"
      hx-ext="loading-states"
      class="bg-slate-800 text-zinc-200"
    >
      {children}
    </body>
  </html>
);
