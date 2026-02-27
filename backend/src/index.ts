import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins dynamically (required when credentials are true and we don't know the exact frontend URL)
        callback(null, origin || true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Task Management API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        app.listen(config.port, () => {
            console.log(`\n🚀 Server running on http://localhost:${config.port}`);
            console.log(`📊 Environment: ${config.nodeEnv}`);
            console.log(`🔗 Frontend URL: ${config.frontendUrl}\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
