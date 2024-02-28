const Project = require("../Model/ProjectModel");
const Employee = require("../Model/EmployeeModel");
const { StatusCodes } = require("http-status-codes");

const createProject = async (req, res) => {
    try {
        const foundProject = await Project.findOne({ label: req.body.label });
        if (foundProject) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: `${foundProject.label} already exists.` });
        }
        const project = new Project({
            label: req.body.label,
            description: req.body.description,
        });

        if (!project.label || !project.description) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all project information!" });
        }
        await project.save();
        // Sending a success response
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${project.label} was registered successfully!` });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

const getAllProject = async (req, res) => {
    try {
        // Finding all projects in the database
        const projects = await Project.find({});
        // Mapping the project data to a simpler format
        const data = projects.map((project) => {
            return {
                label: project.label,
                description: project.description,
            };
        });
        res.status(StatusCodes.ACCEPTED).json({ Projects: data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to update an employee
const updateProject = async (req, res) => {
    try {
        // Checking if all required properties are provided in the request body
        if (!req.body.label || !req.body.description) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all project information!" });
        }
        // Creating an update object with data from the request body
        const update = {
            label: req.body.label,
            description: req.body.description,
        };
        // Finding and updating the project with the provided email
        const updatedProject = await Project.findOneAndUpdate(
            { label: req.params.label },
            update,
            { new: true }
        );
        if (!updatedProject) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Project not found." });
        }
        // Sending a success response with the updated project data
        res.status(StatusCodes.OK).json({ updatedProject });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to delete a project
const deleteProject = async (req, res) => {
    try {
        // Checking if the project email is provided
        const projectLabel = req.params.label;
        if (!projectLabel) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Missing employee email." });
        }
        // Finding and deleting the project with the provided email
        const project = await Project.findOneAndDelete({
            label: project.label,
        });

        if (!project) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Project not found." });
        }
        res
            .status(StatusCodes.OK)
            .json({ message: "Project was deleted successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

//à modifier
const assignToEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: employeeEmail });
        if (!employee) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: `Employee with email ${employeeEmail} not found` });
        }
        await Project.findByIdAndUpdate(Project._id, {
            assignedEmployee: employee._id,
        });
        return res
            .status(StatusCodes.ACCEPTED)
            .send({
                message: `Project assigned to employee ${employeeEmail} successfully`,
            });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

module.exports = {
    createProject,
    getAllProject,
    updateProject,
    deleteProject,
    assignToEmployee,
};
