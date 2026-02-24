console.log('>>> SERVER.JS STARTING <<<');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Import Routes
const authRoutes = require('./routes/Auth');
const summarizeRoutes = require('./routes/Summarize');
const chatRoutes = require('./routes/Chat');
const matchmakingRoutes = require('./routes/Matchmaking');
const communityRoutes = require('./routes/Community');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/community', communityRoutes);

// Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base Route
app.get('/', (req, res) => {
    res.send('Trellis MERN Server is Operational 🚀');
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