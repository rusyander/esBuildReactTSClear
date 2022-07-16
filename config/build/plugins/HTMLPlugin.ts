import { Plugin } from "esbuild";
import { rm, writeFile } from "fs/promises";
import path from "path";
import { Script } from "vm";

interface HTMLPlaginOptions {
  template?: string;
  title?: string;
  jsPath?: string[];
  cssPath?: string[];
}

const preparePath = (outputs: string[]) => {
  return outputs.reduce<Array<string[]>>(
    (acc: any, path: any) => {
      const [js, css] = acc;
      const splittedFileName = path.split("/").pop();
      if (splittedFileName?.endsWith(".js")) {
        js.push(splittedFileName);
      } else if (splittedFileName?.endsWith(".css")) {
        css.push(splittedFileName);
      }
      return acc;
    },
    [[], []]
  );
};

const renderHTML = (options: HTMLPlaginOptions): string => {
  return (
    options.template ||
    ` <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${options.title}</title>
           
            ${options?.cssPath
              ?.map((path) => ` <link rel="stylesheet" href=${path} />`)
              .join(" ")}
          </head>
          <body>
            <div id="root"></div>
            ${options?.jsPath
              ?.map((path) => `<script src=${path}></script>`)
              .join(" ")}

            <script>
                const envSource = new EventSource('http://localhost:4000/subscribe');
                envSource.onopen = function(event) {
                    console.log('open');
                }

                envSource.onerror = function(event) {
                    console.log('error');
                }

                envSource.onmessage = function(event) {
                    console.log('message');
                    window.location.reload();
                }

            </script>
          </body>
        </html>`
  );
};

export const HTMLPlugin = (options: HTMLPlaginOptions): Plugin => {
  return {
    name: "HTMLPlugin",

    setup(build) {
      const outdir = build.initialOptions.outdir;
      build.onStart(async () => {
        try {
          if (outdir) {
            // проверить путь на существование и права доступа к папке билда
            await rm(outdir, { recursive: true }).catch(() => {});
            // console.log(outdir);
          }
        } catch (e) {
          console.error("Не удалось очистить папку build");
        }
      });

      build.onEnd(async (result) => {
        const outputs = result.metafile?.outputs;
        const [jsPath, cssPath] = preparePath(Object.keys(outputs || {}));

        if (outdir) {
          await writeFile(
            path.resolve(outdir, "index.html"),
            renderHTML({ jsPath, cssPath, ...options })
          );
        }
      });
    },
  };
};
