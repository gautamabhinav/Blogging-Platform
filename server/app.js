import cookieParser from 'cookie-parser';
config();
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';
import path from "path";

// Import all routes
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js'
import superadminRoutes from './routes/superadmin.routes.js'
import blogRoutes from './routes/blog.routes.js';
import CategoryRoute from './routes/category.routes.js';
import likeRoutes from './routes/like.routes.js';
import contactRoute from './routes/contact.routes.js';
import statsRoute from './routes/stats.routes.js';
import commentRoutes from './routes/comment.routes.js'


// import miscRoutes from './routes/miscellaneous.routes.js';


const app = express();

// Middlewares
// Built-In
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Third-Party
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());

const _dirname = path.resolve();




// Server Status Check Route
app.get('/ping', (_req, res) => {
  res.send('Pong');
});



app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/superadmin', superadminRoutes);
app.use('/api/v1/posts', blogRoutes);
app.use('/api/v1/contact', contactRoute);
app.use('/api/v1/stats', statsRoute);
// app.use('/api/v1', miscRoutes);

// app.use('/api/v1/blogLikes', BlogLikeRoute);
app.use('/api/v1/category', CategoryRoute);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/comments", commentRoutes )

// Default catch all route - 404
app.use((_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});

// Custom error handling middleware
app.use(errorMiddleware);

// app.use(express.static(path.join(_dirname, "/client/build")));
// app.get('*', (_,res) => {
//   res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
// });

export default app;