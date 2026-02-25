console.log('>>> SERVER.JS STARTING <<<');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();

// Trust Proxy (Essential for OAuth behind Render/Vercel proxies)
app.set('trust proxy', 1);

// Middlewares
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow local development, specific FRONTEND_URL, or any Vercel preview URL
        if (!origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Import Routes
const authRoutes = require('./routes/Auth');
const summarizeRoutes = require('./routes/Summarize');
const chatRoutes = require('./routes/Chat');
const matchmakingRoutes = require('./routes/Matchmaking');
const communityRoutes = require('./routes/Community');
const collaborationRoutes = require('./routes/collaboration');
const diagnosticRoutes = require('./routes/Diagnostic');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/diag', diagnosticRoutes);

// Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base Route
app.get('/', (req, res) => {
    res.send('Trellis MERN Server is Operational 🚀');
});

// Global Error Handler for JSON responses (Must be after routes)
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(err.status || 500).json({
        msg: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Success: Connected to MongoDB Cluster0');
        app.listen(PORT, () => console.log(`🚀 Trellis Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Connection Error:', err.message);
    });