import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import logger from "morgan";
import session from "express-session";


import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

// Import routes
import indexRouter from "./routes/index.rout.js";
import userrouter from "./routes/user.rout.js";
// import adminrouter from "./routes/admin.rout.js";

// Read the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "any secret" }));


//ROUTES
app.use("/", indexRouter);
app.use("/user", userrouter);
// app.use("/admin", adminrouter);

// Error Handling handles error in code
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("pages/error");
});

// 404 page if ml2ash el page
app.use((req, res) => {
  res
    .status(404)
    .render("pages/404", {
      user: req.session.user === undefined ? "" : req.session.user,
    });
});

export default app;
