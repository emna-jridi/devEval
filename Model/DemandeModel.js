const mongoose = require('mongoose')

const demandeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],

    },
    start_date: {
        type: Date,
        required: [true, "Please provide a start date of the demand "],
    },
    end_date: {
        type: Date,
        required: [true, "Please provide an end date of the demand"]
    },
    estimation: {
        type: String,
        required: [true, "Please provide an estimation"]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    },
    release: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'release'
    }


})

module.exports = mongoose.model("demande", demandeSchema)