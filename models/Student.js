const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: { type: String, required: true },

    dob: String,
    gender: String,
    city: String,

    /* 10th */
    school10: String,
    board10: String,
    secured10: { type: Number, default: 0 },
    total10: { type: Number, default: 0 },

    /* 12th */
    college12: String,
    board12: String,
    secured12: { type: Number, default: 0 },
    total12: { type: Number, default: 0 },

    /* Graduation */
    degree: String,
    university: String,
    securedGrad: { type: Number, default: 0 },
    totalGrad: { type: Number, default: 0 },

    course: String,
    semester: String

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);