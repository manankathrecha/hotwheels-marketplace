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
  const allowedOrigins = [
  "http://localhost:3000",
  "https://hotwheels-marketplace.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools like curl/Postman (no origin)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
