import ESBuild from "esbuild";
import config from "./esbuild-config";

// const PORT: any = process.env.PORT || 4000;

ESBuild.build(config).catch((e) => {
  console.error(e);
});
