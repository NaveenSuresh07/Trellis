const mongoose = require('mongoose');

const CollaborationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: false // Optional if it's a file-only message
        },
        fileUrl: {
            type: String
        },
        fileType: {
            type: String,
            enum: ['image', 'video', 'pdf', null],
            default: null
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    notes: [{
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Ensure only one collaboration exists between any two specific participants (order-agnostic)
CollaborationSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.model('Collaboration', CollaborationSchema);
