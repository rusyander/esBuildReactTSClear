import { Plugin } from "esbuild";
import { rm } from "fs/promises";

export const ClearPlugin: Plugin = {
  name: "ClearPlugin",
  setup(build) {
    build.onStart(async () => {
      try {
        const outdir = build.initialOptions.outdir;
        if (outdir) {
          // проверить путь на существование и права доступа к папке билда
          await rm(outdir, { recursive: true }).catch(() => {});
          // console.log(outdir);
        }
      } catch (e) {
        console.error("Не удалось очистить папку build");
      }
    });

    build.onEnd(() => {
      console.log("build end");
    });
  },
};
