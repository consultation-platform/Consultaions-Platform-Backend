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
const consFieldsRoutes = require("./routes/cons.fields.routes");
const authRoutes = require("./routes/auth.routes");
const contactUsRoutes = require("./routes/contactUs.routes");
const mentorsRoutes = require("./routes/mentor.routes");
const honorBoardRoutes = require("./routes/honor.board.routes");
const coursesRoutes = require("./routes/courses.routes.js");
const videosRoutes = require("./routes/video.routes.js");
const consTicketRoutes = require("./routes/cons.tickets.routes.js");
const questionRoutes = require("./routes/question.routes.js");
const commentRoutes = require("./routes/comments.routes.js");
const repliesRoutes = require("./routes/replies.routes.js");
const coverRoutes = require("./routes/cover.routes.js");
const toolsRoutes = require("./routes/tools.routes.js");
const aboutUsRoutes = require("./routes/about-us.routes.js");
const bookRoutes = require("./routes/book.routes.js");
const servicesRoutes = require("./routes/services.routes.js");
const coachProgramRoutes = require("./routes/coach-program.routes.js");

app.use(express.json());
app.use(cookieParser());

// DATABASE CONNECTION
dbConnection();

// LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Node: ${process.env.NODE_ENV}`);
}

// CORS
// app.use(
//   cors({
//     credentials: true,
//     origin: [
//       "http://localhost:5173",
//       "https://sayeesu.onrender.com",
//       "https://booking21102001.netlify.app",
//       "https://consultation-s2p9.onrender.com",
//       "https://www.sayeesu.com",
//       "https://sayeesu.com",
//       "*",
//     ],
//   })
// );

//Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cons-fields", consFieldsRoutes);
app.use("/api/contact", contactUsRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/honor-board", honorBoardRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/cons-tickets", consTicketRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/replies", repliesRoutes);
app.use("/api/cover", coverRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/about-us", aboutUsRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/coach-program", coachProgramRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handling middleware for express
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

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
