const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");



const cancelRequestSchema = new Schema({
    
    cancelId: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true // Automatically add createdAt and updatedAt timestamps
    });


const CancelRequest = model('CancelRequest', cancelRequestSchema);

module.exports = CancelRequest;
