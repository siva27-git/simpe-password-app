const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: true,
        },
        noOfSteps: {
            type: Number,
            required: true
        }
    },
    {
        collection: "passwords",
        timestamps: true,
    }
);

module.exports = mongoose.model("Passwords", schema);