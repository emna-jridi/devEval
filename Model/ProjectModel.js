const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, "Please provide a label "],
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],

    },

    assignedEmployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    }
}, { timestamps: true })



module.exports = mongoose.model("project", projectSchema)





