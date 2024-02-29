const Demand = require('../Model/DemandeModel')
const { StatusCodes } = require('http-status-codes')


const createDemand = async (req, res) => {
    try {
        const foundDemand = await Demand.findOne({ title: req.body.title })
        if (foundDemand) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${foundDemand.title}  already exists.`
            })
        }
        const demand = new Demand({
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimation: req.body.estimation,
        })
        if (!req.body.title || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.estimation) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all demand information!" });
        }
        await demand.save();
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${demand.title} was registered successfully!` });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}


const getAllDemand = async (req, res) => {
    try {
        const demands = await Demand.find({})

        const data = demands.map((demand) => {
            return {
                title: demand.title,
                description: demand.description,
                start_date: demand.start_date,
                end_date: demand.end_date,
                estimation: demand.estimation,
            }

        })
        res.status(StatusCodes.ACCEPTED).json({ Demands: data })
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}

const updateDemand = async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.start_date || !req.body.end_date || !req.body.estimation) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all demand information!" });
        }
        const update = {
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimation: req.body.estimation,
        }

        const updatedDemand = await Demand.findOneAndUpdate({ title: req.params.title }, update, { new: true })
        if (!updatedDemand) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Demand not found." });
        }
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}

const deleteDemand = async (req, res) => {
try {
    const demandTitle= req.params.title
if (!demandTitle){
    return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "Missing Demand Title." });
}
} catch (error) {
    
}
}


