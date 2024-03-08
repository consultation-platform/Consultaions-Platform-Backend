const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const ApiError = require("./utils/api.error");
const dotenv = require("dotenv").config();
const cors = require("cors");

const globalError = require("./middlewares/error.middleware");
const dbConnection = require("./configs/db.config");

//ROUTES
const userRoutes = require("./routes/user.routes");
const consFieldsRoutes = require("./routes/cons.fields.route");
const authRoutes = require("./routes/auth.routes");
const contactUsRoutes = require("./routes/contactUs.routes");
const mentorsRoutes = require("./routes/mentor.routes");
const honorBoardRoutes = require("./routes/honor.board.routes");

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cons-fields", consFieldsRoutes);
app.use("/api/contactUs", contactUsRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/honor-board", honorBoardRoutes);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);
dbConnection();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://booking21102001.netlify.app/",
      "*",
    ],
  })
);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
