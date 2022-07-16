import ESBuild from "esbuild";
import config from "./esbuild-config";
import express from "express";
import path from "path";
import { EventEmitter } from "events";

const PORT = Number(process.env.PORT || 4000);
const emitter = new EventEmitter();

const app = express();
app.listen(PORT, () => {
  console.log(`ESBuild server started on port  http://localhost:${PORT}`);
});
app.use(express.static(path.resolve(__dirname, "..", "..", "build")));

app.get("/subscribe", (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };
  res.writeHead(200, headers);
  res.write("");

  emitter.on("refresh", () => {
    res.write("data: message \n\n");
  });
});

function sendMessage() {
  emitter.emit("refresh", "123");
}

ESBuild.build({
  ...config,
  watch: {
    onRebuild(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("build...");
        sendMessage();
      }
    },
  },
})
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.error(e);
  });
