const mongoose = require("mongoose");
const validator = require("validator");
const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your full name"],
    }

    ,
    email: {
        type: String,
        required: [true, "Please provide an email ! "],

        validate: [validator.isEmail, "Please provide a valid email"],
        unique: true,
    },
    position: {
        type: String,
        required: [true, "Please provide the position !"],
    },
    rank: {
        type: String,
        required: [true, "Please provide the rank !"],
    },
    entryDate: {
        type: Date,
        required: [true, "Please provide the entry date  !"],
    },


}, { timestamps: true } //createdAt & updatedAt are handled automatically.
)


module.exports = mongoose.model("employee", employeeSchema)