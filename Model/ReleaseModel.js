const mongoose = require('mongoose')


const releaseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, "Please provide a description of the release "],
    },
    start_date: {
        type: Date,
        required: [true, "Please provide a start date of the release "],
    },
    end_date: {
        type: Date,
        required: [true, "Please provide an end date of the release"]
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
    }
})


module.exports = mongoose.model("release", releaseSchema)