const mongoose = require("mongoose");
const {EmpolyeeValidationSchema}= require('../Config/ValidatorConfig')

const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your full name"],
    }
    ,
    email: {
        type: String,
        required: [true, "Please provide an email ! "],
        unique: true,
    },
    position: {
        type: String,
        required: [true, "Please provide the position !"],
    },
    rank: {
        type: Number,
        required: [true, "Please provide the rank !"],
    },
    entryDate: {
        type: Date,
        required: [true, "Please provide the entry date  !"],
    },


}, { timestamps: true } //createdAt & updatedAt are handled automatically.
)

//a verifier
employeeSchema.pre('save', function(next){
    const {error} = EmpolyeeValidationSchema.validate(this.toObject());
if (error){
    throw new Error(`validation error: ${error.message}`)
}
})

module.exports = mongoose.model("employee", employeeSchema)