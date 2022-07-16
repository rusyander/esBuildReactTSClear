import ESBuild, { BuildOptions } from "esbuild";
import path from "path";
import { ClearPlugin } from "./plugins/ClearPlugin";
import { HTMLPlugin } from "./plugins/HTMLPlugin";

const mode: any = process.env.MODE || "development";

const isDev = mode === "development";
const isProd = mode === "production";

function resolveRoot(...segments: any[]) {
  return path.resolve(__dirname, "..", "..", ...segments);
}

const config: BuildOptions = {
  outdir: resolveRoot("build"),
  entryPoints: [resolveRoot("src", "index.jsx")],
  entryNames: "[dir]/bundle.[name]-[hash]",
  allowOverwrite: true,
  bundle: true,
  minify: isProd,
  sourcemap: isDev,
  metafile: true,
  tsconfig: resolveRoot("tsconfig.json"),
  loader: { ".png": "file", ".svg": "file", ".jpg": "file" },
  plugins: [ClearPlugin, HTMLPlugin({ title: "ESBuild" })],
};

export default config;
