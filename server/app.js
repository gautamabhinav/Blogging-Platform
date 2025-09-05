import express from "express";
import http from "http";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import errorMiddleware from "./middlewares/error.middleware.js";

// Load env first
config();

// Import routes
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import contactRoute from "./routes/contact.routes.js";
import statsRoute from "./routes/stats.routes.js";


import Comment from "./models/comment.model.js";

const app = express();

// ------------------- Middlewares -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------- Routes -------------------
app.get("/ping", (_req, res) => {
  res.send("Pong");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/posts", blogRoutes);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/stats", statsRoute);
app.use("/api/v1/category", categoryRoutes);

// ------------------- Socket.IO -------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_blog", (blogId) => {
    socket.join(blogId);
    console.log(`User ${socket.id} joined blog room ${blogId}`);
  });

  socket.on("new_comment", async ({ blogId, userId, comment, parentId }) => {
    try {
      const newComment = new Comment({
        blogId,
        user: userId,
        comment,
        parentId: parentId || null,
      });
      await newComment.save();

      const populated = await newComment.populate("user", "name avatar");

      io.to(blogId).emit("comment_added", populated);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("delete_comment", async ({ blogId, commentId }) => {
    try {
      await Comment.findByIdAndDelete(commentId);
      io.to(blogId).emit("comment_deleted", commentId);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ------------------- Fallbacks -------------------
app.use((_req, res) => {
  res.status(404).send("OOPS!!! 404 Page Not Found");
});

app.use(errorMiddleware);

// ------------------- Export server -------------------
export { app, server };
