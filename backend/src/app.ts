import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { apiRouter } from "./routes/api";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());

  // CORS: reflect the request origin (localhost, Vercel, etc.)
  app.use(
    cors({
      origin: true,        // echo back whatever Origin the browser sends
      credentials: true,   // allow cookies / auth headers if needed
    })
  );

  // Optional but nice: handle preflight for all routes
  app.options("*", cors({ origin: true, credentials: true }));


  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
