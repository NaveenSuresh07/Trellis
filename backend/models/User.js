const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    interests: [String],
    notes: [{ content: String, summary: String }]
});
module.exports = mongoose.model('User', UserSchema);