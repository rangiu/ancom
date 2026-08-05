import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import voteRoutes from './routes/vote';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled CSP header restrictions for AdSense flexibility
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Fallback allow for public deployment ease
      }
    },
    credentials: true,
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', voteRoutes);

// Global 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Eat Rice (Ăn Cơm) Backend server listening on port ${PORT}`);
});
