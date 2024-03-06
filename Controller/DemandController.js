const Demand = require("../Model/DemandModel");
const Release = require("../Model/ReleaseModel");
const { StatusCodes } = require("http-status-codes");

// Function to create a new demand
const createDemand = async (req, res) => {
    try {
        const foundDemand = await Demand.findOne({ title: req.body.title });
        // Checking if a demand with the provided title already exists
        if (foundDemand) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${foundDemand.title}  already exists.`,
            });
        }
        // Creating a new demand instance with data from the request body
        const demand = new Demand({
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimation: req.body.estimation,
        });
        // Checking if all required properties are provided
        if (
            !req.body.title ||
            !req.body.description ||
            !req.body.start_date ||
            !req.body.end_date ||
            !req.body.estimation
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all demand information!" });
        }
        // Saving the new demand to the database
        await demand.save();
        // Sending a success response
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${demand.title} was registered successfully!` });
        // Sending an internal server error response if an error occurs
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to retrieve all demands
const getAllDemand = async (req, res) => {
    try {
        // Finding all employees in the database
        const demands = await Demand.find({});
        // Mapping the demands data to a simpler format
        const data = demands.map((demand) => {
            return {
                title: demand.title,
                description: demand.description,
                start_date: demand.start_date,
                end_date: demand.end_date,
                estimation: demand.estimation,
                release: demand.release,
            };
        });
        res.status(StatusCodes.ACCEPTED).json({ Demands: data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to update a demand
const updateDemand = async (req, res) => {
    try {
        const demandTitle = req.params.title;
        if (!demandTitle) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Missing Demand Title." });
        }
        // Checking if all required properties are provided in the request body
        if (
            !req.body.title ||
            !req.body.description ||
            !req.body.start_date ||
            !req.body.end_date ||
            !req.body.estimation
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all demand information!" });
        }
        // Creating an update object with data from the request body
        const update = {
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            estimation: req.body.estimation,
        };
        // Finding and updating the demand with the provided title
        const updatedDemand = await Demand.findOneAndUpdate(
            { title: demandTitle },
            update,
            { new: true }
        );
        if (!updatedDemand) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Demand not found." });
        }
        // Sending a success response with the updated demand data
        return res.status(StatusCodes.OK).json({ updatedDemand });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to delete a demand
const deleteDemand = async (req, res) => {
    try {
        // Checking if the demand title is provided
        const demandTitle = req.params.title;
        if (!demandTitle) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Missing Demand Title." });
        }
        // Finding and deleting the demand with the provided title
        const demand = await Demand.findByIdAndDelete({
            title: demandTitle,
        });
        if (!demand) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Demand not found." });
        }
        res
            .status(StatusCodes.OK)
            .json({ message: "Demand was deleted successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

//assign a release to a demand
const assignToRelease = async (req, res) => {
    try {
        const demandTitle = req.params.title;
        const releaseName = req.body.name;
        // Finding release with provided name
        const releaseFound = await Release.findOne({ name: releaseName });
        if (!releaseFound) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: `Release with name ${releaseName} not found` });
        }
        //finding demand with provided title
        demandFound = await Demand.findOne({ title: demandTitle });
        //cheking if the demand already assigned
        if (demandFound.release && demandFound.release.id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${demandTitle} already assigned`,
            });
        }
        // Creating an update object
        const update = {
            release: {
                id: releaseFound._id,
                name: releaseFound.name,
                assignedProject: {
                    id: releaseFound.assignedProject.id,
                    label: releaseFound.assignedProject.label,
                },
            },
        };
        //Finding and updating the demand
        await Demand.findOneAndUpdate({ title: demandTitle }, update, {
            new: true,
        });
        // Sending a success response
        return res.status(StatusCodes.ACCEPTED).send({
            message: `Demand ${demandTitle} assigned to release ${releaseName} successfully`,
        });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

module.exports = {
    createDemand,
    getAllDemand,
    updateDemand,
    deleteDemand,
    assignToRelease,
};
