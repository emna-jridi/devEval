const Release = require("../Model/ReleaseModel");
const Project = require("../Model/ProjectModel");
const { StatusCodes } = require("http-status-codes");

const createRelease = async (req, res) => {
    try {
        const foundRelease = await Release.findOne({ name: req.body.name });
        if (foundRelease) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${foundRelease.name}already exists.`,
            });
        }
        const release = new Release({
            name: req.body.name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        });
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
        await release.save();
        res
            .status(StatusCodes.ACCEPTED)
            .json({ message: `${release.name} was registered successfully!` });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

const getAllReleases = async (req, res) => {
    try {
        const releases = await Release.find({});
        const data = releases.map((release) => {
            return {
                id: release.id,
                name: release.name,
                description: release.description,
                start_date: release.start_date,
                end_date: release.end_date,
            };
        });
        res.status(StatusCodes.ACCEPTED).json({ Releases: data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

const updateRelease = async (req, res) => {
    try {
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

        const update = {
            name: req.body.name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        };
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
        res.status(StatusCodes.OK).json({ updatedRelease });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

const deleteRelease = async (req, res) => {
    try {
        const release = await Release.findOneAndDelete({
            name: req.params.name,
        });
        if (!release) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Release not found." });
        }
        res
            .status(StatusCodes.OK)
            .json({ message: "Release was deleted successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

const assignToProject = async (req, res) => {
    try {
        const projectLabel = req.body.label;
        const releaseName = req.params.name;
        const projectFound = await Project.findOne({ label: projectLabel });
        if (!projectFound) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: `Project with label ${projectLabel} not found` });
        }
        releaseFound = await Release.findOne({ name: releaseName });

        if (releaseFound.assignedProject.id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${releaseName} already assigned`,
            });
        }
        const update = {
            assignedProject: {
                id: projectFound._id,
                label: projectFound.label,
            },
        };

        await Release.findOneAndUpdate({ name: releaseName }, update, {
            new: true,
        });

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
