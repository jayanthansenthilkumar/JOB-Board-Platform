import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Job Board API",
      version: "1.0.0",
      description:
        "This is a REST API application made with Express and Prisma written in TypeScript. It retrieves data from a PostgreSQL database.",
      contact: {
        name: "sashauly",
        url: "https://github.com/sashauly",
        email: "sashauly.code@gmail.com",
      },
    },
    basePath: "/api",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server",
      },
    ],
  },
  apis: [__dirname + "/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

import cookieParser from "cookie-parser";
import HttpStatusCodes from "./constants/HttpStatusCodes";
import Paths from "./constants/Paths";
import errorHandler from "./middleware/errorHandler";
import BaseRouter from "./routes/api.routes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use(Paths.Base, BaseRouter);

app.use(Paths.Base + "/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_FOUND).json({
    status: HttpStatusCodes.NOT_FOUND,
    data: {
      error: "Not found",
    },
  });
});

export default app;
