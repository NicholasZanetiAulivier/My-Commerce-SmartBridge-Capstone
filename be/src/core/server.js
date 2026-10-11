const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const pinoHTTP = require("pino-http");
const config = require("./config");
const router = require("../components/routes");
const { errorResponder, errors } = require("./errors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const logger = require('./logger')('app');

module.exports = (app) => {
  // app.enable('trust proxy');
  app.set('trust proxy', 1);

  app.use(cors());

  app.use(methodOverride("_method"));

  // buat GSI
  app.use(cookieParser());

  app.use(bodyParser.json({ limit: "5mb" }));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(pinoHTTP({ logger }));

  app.use(compression());

  // to silence the 404 favicon.ico
  app.get("/favicon.ico", (req, res, next) => {
    return res.status(204).end();
  });

  // app.use(globalLimiterMinute(100));

  // healthcheck endpoint
  app.get('/', (req, res, next) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    };
    try {
      res.json(healthcheck);
    } catch (e) {
      healthcheck.message = e;
      res.status(503).json();
    }
  })

  //Main Router
  app.use(config.api.prefix, router);

  //404 not found
  app.use((req, res, next) => {
    return next(errorResponder(errors.ROUTE_NOT_FOUND, "Route not found"));
  });

  // Error loggers
  app.use((error, request, response, next) => {
    const ctx = {
      code: error.code,
      status: error.status,
      description: error.description,
    };

    // If this error is thrown by our code execution, then also log the stack trace
    if (error.stack) {
      ctx.stack = error.stack;
    }

    logger.error(ctx, error.toString());

    return next(error);
  });

  //Error Response
  app.use((err, req, res, next) => {
    let errorObj = {
      statusCode: err.status || 500,
      error: err.code || "UNKNOWN_ERROR",
      description: err.description || "Unknown error",
      message: err.status ? err.message : "An error has occurred", // message obfuscation
    };

    if (err.status === 500) {
      obj = errorObj;
      errorObj = {
        ...obj,
        message: "An error has occurred", // message obfuscation
      };
    }
    res.status(err.status || 500).json(errorObj);
  });
};
