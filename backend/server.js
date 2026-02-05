require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const MONGO_URI ='mongodb+srv://Naveensuresh:Minnumol%401602@cluster0.gsngyjn.mongodb.net/?appName=Cluster0'
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
            console.log("✅ Trellis DB Connected for Naveen's CSE Project");
        }
    } catch (err) {
        console.error("❌ DB Connection Failed!");
        console.error("Error Detail:", err.message);
    }
};

connectDB();

// 2. DATA MODELS
const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    interests: [String],
    notes: [{ text: String, summary: String, date: { type: Date, default: Date.now } }]
});

const User = mongoose.model('User', UserSchema);

// 3. API ROUTES

// Check if Backend is live
app.get('/', (req, res) => {
    res.send('Trellis Backend is Live and Ready for CSE Presentation');
});

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, interests } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ username, email, interests });
            await user.save();
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Summarizer Logic (Simulated for 50% Milestone)
app.post('/api/summarize', async (req, res) => {
    try {
        const { text, userId } = req.body;
        const summary = text.split(' ').slice(0, 10).join(' ') + "...";
        
        const user = await User.findById(userId);
        user.notes.push({ text, summary });
        await user.save();
        
        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Community Feed
app.get('/api/notes', async (req, res) => {
    try {
        const users = await User.find({}, 'username notes');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. SERVER INITIALIZATION
const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
    console.log(`🚀 Trellis Server running on http://localhost:5000`);
});