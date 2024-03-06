const Release = require("../Model/ReleaseModel");
const Project = require("../Model/ProjectModel");
const { StatusCodes } = require("http-status-codes");


// Function to create a new Release
const createRelease = async (req, res) => {
    try {
        const foundRelease = await Release.findOne({ name: req.body.name });
        // Checking if a Release with the provided name already exists
        if (foundRelease) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${foundRelease.name}already exists.`,
            });
        }
        // Creating a new Release instance with data from the request body
        const release = new Release({
            name: req.body.name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        });
        // Checking if all required properties are provided
        if (
            !release.name ||
            !release.description ||
            !release.start_date ||
            !release.end_date
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all release information!" });
        }
        // Saving the new Release to the database
        await release.save();
        // Sending a success response
        return res
            .status(StatusCodes.ACCEPTED)
            .json({ message: `${release.name} was registered successfully!` });
    } catch (error) {
        // Sending an internal server error response if an error occurs
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to retrieve all Releases
const getAllReleases = async (req, res) => {
    try {
        // Finding all Releases in the database and  populating the 'assignedProject' field with project details
        const releases = await Release.find({}).populate(
            'assignedProject',
            '-_id label'
        );
        // Mapping the demands data to a simpler format
        const data = releases.map((release) => {
            return {
                id: release.id,
                name: release.name,
                description: release.description,
                start_date: release.start_date,
                end_date: release.end_date,
                assignedProject: release.assignedProject,
            };
        });
        return res.status(StatusCodes.ACCEPTED).json({ Releases: data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to update a Release
const updateRelease = async (req, res) => {
    try {
        // Checking if all required properties are provided in the request body
        if (
            !req.body.name ||
            !req.body.description ||
            !req.body.start_date ||
            !req.body.end_date
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all Release information!" });
        }
        // Creating an update object with data from the request body
        const update = {
            name: req.body.name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        };
        // Finding and updating the Release with the provided title
        const updatedRelease = await Release.findOneAndUpdate(
            { name: req.params.name },
            update,
            { new: true }
        );
        if (!updatedRelease) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Release not found." });
        }
        // Sending a success response with the updated demand data
        return res.status(StatusCodes.OK).json({ updatedRelease });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to delete Release
const deleteRelease = async (req, res) => {
    try {
        // Finding and deleting the Release with the provided name
        const release = await Release.findOneAndDelete({
            name: req.params.name,
        });
        if (!release) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Release not found." });
        }
        return res
            .status(StatusCodes.OK)
            .json({ message: "Release was deleted successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

//assign a project to a release
const assignToProject = async (req, res) => {
    try {
        const projectLabel = req.body.label;
        const releaseName = req.params.name;
        // Finding project with provided label
        const projectFound = await Project.findOne({ label: projectLabel });
        if (!projectFound) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: `Project with label ${projectLabel} not found` });
        }
        //finding release with provided name
        releaseFound = await Release.findOne({ name: releaseName });
        //cheking if the Release already assigned
        if (releaseFound.assignedProject.id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${releaseName} already assigned`,
            });
        }
        // Creating an update object
        const update = {
            assignedProject: {
                id: projectFound._id,
                label: projectFound.label,
            },
        };
        //Finding and updating the Release
        await Release.findOneAndUpdate({ name: releaseName }, update, {
            new: true,
        });
        // Sending a success response
        return res.status(StatusCodes.ACCEPTED).send({
            message: `Release ${releaseName} assigned to project ${projectLabel} successfully`,
        });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};






module.exports = {
    createRelease,
    getAllReleases,
    updateRelease,
    deleteRelease,
    assignToProject,
};
