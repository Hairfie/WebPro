import path from "path";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import morgan from "morgan";
import app from "./app";
import config from "./config";
import render from "./server/render";

// Initialize express server

const server = express();

// Usual express stuff

server.use(morgan(server.get("env") === "production" ? "combined" : "dev"));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(compression());
server.use(favicon(path.resolve(__dirname, "./assets/favicon.png")));

// On production, use the public directory for static files
// This directory is created by webpack on build time.

if (server.get("env") === "production") {
  server.use(express.static(path.resolve(__dirname, "../public"), {
    maxAge: 365 * 24 * 60 * 60
  }));
}

// On development, serve the static files from the webpack dev server.

if (server.get("env") === "development") {
  require("../webpack/server");
}

const assetsDir = path.resolve(__dirname, "assets");
server.use("/assets", express.static(assetsDir, { maxAge: 365 * 24 * 60 * 60 } ));

// Render the app server-side and send it as response

server.use(render);

// Generic server errors (e.g. not caught by components)
server.use((err, req, res, next) => {
  console.log("Error on request %s %s", req.method, req.url);
  console.log(err.stack || err);
  res.status(500).send("Something bad happened");
});

// Finally, start the express server

server.set("port", process.env.PORT || 3000);

server.listen(server.get("port"), () => {
  console.log(`Express ${server.get("env")} server listening on ${server.get("port")}`);
});

