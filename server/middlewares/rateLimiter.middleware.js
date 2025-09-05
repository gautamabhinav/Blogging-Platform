// import rateLimit from 'express-rate-limit';

// export const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: "Too many requests from this IP, please try again after 15 minutes."
//   },
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
// });


// import rateLimit from 'express-rate-limit';

// export const ultraStrictLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 30, // 30 requests per 10 minutes per IP
//   delayMs: 500, 
//   message: {
//     success: false,
//     error: "🚫 Too many requests. Our servers are busy due to high demand. Please try again shortly.",
//   },
//   handler: (req, res, _next) => {
//     console.warn(`🚨 Rate limit hit: IP ${req.ip}`);
//     res.status(429).json({
//       success: false,
//       error: "⚠️ High traffic! You're being rate limited. Try again later.",
//     });
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });




// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { createClient } from 'redis';

// // Create a Redis client
// // Ensure you have Redis running and the environment variables set correctly  
// const redisClient = createClient({
//    socket: {
//       host: process.env.HOST,
//       port: process.env.REDISPORT 
//     } 
//   });

// await redisClient.connect();

// export const limiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // 100 requests per window
//   message: "Too many requests. Please try again later.",
// });

// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { createClient } from 'redis';

// // Create Redis client
// const redisClient = createClient({
//   socket: {
//     host: process.env.HOST,
//     port: process.env.REDISPORT,
//   },
// });

// // Connect to Redis (ensure this is awaited in an async context or top-level in ESM)
// await redisClient.connect();

// // 🔓 Default Rate Limiter (global use)
// export const limiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // 100 requests
//   message: "Too many requests. Please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // 🔒 Ultra Strict Limiter (for login, register, etc.)
// export const ultraStrictLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 3, // only 3 requests per 5 minutes
//   message: "Too many attempts. Please try again after 5 minutes.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });



// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { createClient } from 'redis';

// // Create Redis client
// const redisClient = createClient({
//   socket: {
//     host: process.env.HOST,
//     port: process.env.REDISPORT,
//   },
// });

// await redisClient.connect();

// // ✅ Global (IP-based) limiter
// export const limiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 15 * 60 * 1000, // 15 mins
//   max: 100,
//   message: "Too many requests from this IP. Try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // ✅ Ultra strict (IP-based) for login, register
// export const ultraStrictLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 3,
//   message: "Too many attempts. Try again in 5 minutes.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // ✅ User-based limiter for logged-in users (based on req.user.id)
// export const userLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   keyGenerator: (req) => {
//     return req.user?.id || req.ip; // fallback to IP if no user (shouldn't happen)
//   },
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 20, // 20 requests per user
//   message: "Too many actions for your account. Slow down.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Ensure to handle Redis connection errors
// redisClient.on('error', (err) => {
//   console.error('Redis Client Error', err);
// });




import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';


const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("❌ REDIS_URL is not defined in environment variables");
}

// Create Redis client
const redisClient = createClient({
  url: redisUrl,
  socket: {
    tls: true,                // Required for Upstash
    tls: redisUrl.startsWith("rediss://"), // enable TLS only if needed
    rejectUnauthorized: false, // Prevents SSL issues

    // host: process.env.HOST || '127.0.0.1',
    // port: process.env.REDISPORT || 6379,
  },
});

await redisClient.connect(); // Must be awaited before using

// General rate limiter by IP
export const ipLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again in 15 minutes.',
  keyGenerator: ipKeyGenerator, // ✅ This solves the IPv6 warning

  standardHeaders: true,
  legacyHeaders: false,

  // 👇 Insert your handler here
  handler: (req, res, _next, options) => {
    console.error(`⚠️ Rate limit hit: ${req.ip}`);
    res.status(options.statusCode).json({
      success: false,
      message: options.message,
    });
  },
});

// Ultra-strict limiter (login/register/forgot-password)
export const ultraStrictLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 5,
  message: 'Too many attempts. Please wait 5 minutes and try again.',
  keyGenerator: ipKeyGenerator, // ✅ This solves the IPv6 warning

  standardHeaders: true,
  legacyHeaders: false,

  // 👇 Insert your handler here
  handler: (req, res, _next, options) => {
    console.error(`⚠️ Rate limit hit: ${req.ip}`);
    res.status(options.statusCode).json({
      success: false,
      message: options.message,
    });
  },
});

// Per-user limiter (for logged-in users)
export const userLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: 'Too many requests from your account. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    console.error(`⚠️ Rate limit hit: ${req.ip}`);
    res.status(options.statusCode).json({
      success: false,
      message: options.message,
    });
  },
});


// import rateLimit, { ipKeyGenerator } from "express-rate-limit";
// import RedisStore from "rate-limit-redis";
// import { createClient } from "redis";

// // ---------------- Redis Client ----------------
// const redisClient = createClient({
//   url: process.env.REDIS_URL, // ✅ Only use URL (Upstash gives this)
//   socket: {
//     tls: true,                 // ✅ Required for Upstash
//     rejectUnauthorized: false, // ✅ Prevent SSL issues
//   },
// });

// // Connect safely
// redisClient.on("error", (err) => {
//   console.error("❌ Redis Client Error:", err);
// });

// await redisClient.connect();

// // ---------------- Shared Handler ----------------
// export const rateLimitHandler = (req, res, _next, options) => {
//   console.warn(`⚠️ Rate limit hit: ${req.ip} on ${req.originalUrl}`);
//   res.status(options.statusCode).json({
//     success: false,
//     message: options.message,
//   });
// };

// // ---------------- IP-based limiter ----------------
// export const ipLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   keyGenerator: ipKeyGenerator,
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: "Too many requests from this IP. Try again in 15 minutes.",
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
// });

// // ---------------- Ultra-strict limiter ----------------
// export const ultraStrictLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   keyGenerator: ipKeyGenerator,
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 5,
//   message: "Too many attempts. Please wait 5 minutes and try again.",
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
// });

// // ---------------- User-based limiter ----------------
// export const userLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 50,
//   message: "Too many requests from your account. Try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
// });



// Ensure Redis connection errors are handled
// redisClient.on('error', (err) => {
//   console.error('Redis Client Error', err);
// });


// const rateLimitHandler = (req, res, _next, options) => {
//   console.error(`⚠️ Rate limit hit: ${req.ip}`);
//   res.status(options.statusCode).json({
//     success: false,
//     message: options.message,
//   });
// };

// // Then inside limiter config
// handler: rateLimitHandler,

// for clean code below to see the code how it should be structured

// export const rateLimitHandler = (req, res, _next, options) => {
//   console.error(`⚠️ Rate limit hit: ${req.ip} on ${req.originalUrl}`);
//   res.status(options.statusCode).json({
//     success: false,
//     message: options.message,
//   });
// };

// export const apiLimiter = rateLimit({
//   store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) }),
//   windowMs: 10 * 60 * 1000,
//   max: 50,
//   message: 'API rate limit exceeded.',
//   handler: rateLimitHandler,
// });




// middlewares/ratelimiter.middleware.js
// import rateLimit from 'express-rate-limit';

// Ultra-strict limiter for sensitive actions (e.g., login, register, password reset)
// export const ultraStrictLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 5, // Limit each IP to 5 requests per windowMs
//     message: 'Too many requests from this IP, please try again after 15 minutes',
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// // User-based limiter for authenticated routes
// // This limiter will only be applied AFTER the user is authenticated (isLoggedIn middleware)
// export const userLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 30, // Limit each authenticated user to 30 requests per minute
//     keyGenerator: (req, res) => {
//         // Use the user's ID from the request (set by isLoggedIn middleware) as the key
//         return req.user.id;
//     },
//     message: 'Too many requests for this user, please try again after 1 minute',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// // Example of an IP-based limiter (not currently used in user.routes.js but provided for context)
// export const ipLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 100, // Limit each IP to 100 requests per hour
//     message: 'Too many requests from this IP, please try again after an hour',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

