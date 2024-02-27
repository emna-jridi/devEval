const Agent = require('../Model/UserModel');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require("bcryptjs");

const ROLES = require('../Config/ConstConfig')

// Function to create a new Agent
const createAgent = async (req, res) => {
    try {
        // Checking if an Agent with the provided email already exists
        const foundAgent = await Agent.findOne({ email: req.body.email })
        if (foundAgent) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: `${foundAgent.fullName} already exists.` });
        }
        // Creating a new Agent instance with data from the request body 
        const agent = new Agent({
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            userType: req.body.userType,
        })
        // Saving the new Agent to the database
        await agent.save()
        // Sending a success response
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${agent.fullName} was registered successfully!` });
        // Sending an internal server error response if an error occurs
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}


// Function to retrieve all Agents
const getAllAgent = async (req, res) => {
    try {
        // Finding all Agents in the database
        const agents = await Agent.find({ userType: { $in: [ROLES.RPA, ROLES.RTA] } })
        // Mapping the Agent data to a simpler format
        const data = agents.map((agent) => {
            return {
                fullName: agent.fullName,
                email: agent.email,
                job: agent.userType,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
            }
        })
        res.status(StatusCodes.ACCEPTED).json({ agents: data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}

// Function to update an Agent
const updateAgent = async (req, res) => {
    try {
        // Checking if all required properties are provided in the request body
        if (!req.body.email || !req.body.userType || !req.body.fullName) {

            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide a full Name ,an email and a position !" });
        }
        // Creating an update object with data from the request body
        const update = {
            email: req.body.email,
            userType: req.body.userType,
            updatedAt: new Date()
        };
        // Finding and updating the Agent with the provided email
        const updatedAgent = await User.findOneAndUpdate(
            { email: req.params.email },
            update,
            { new: true }
        );
        if (!updatedAgent) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }
        // Sending a success response with the updated Agent data    
        res.status(StatusCodes.OK).json({ updatedAgent });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};


// Function to delete an Agent
const deleteAgent = async (req, res) => {
    try {
// Checking if the Agent email is provided
        const agentEmail = req.params.email;
        const agent = await Agent.findOneAndDelete({ email: agentEmail })
        if (!agent) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Agent not found." });

        }
        res.status(StatusCodes.OK).json({ message: "Agent was deleted successfully!" });


    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}


module.exports = {
    createAgent,
    getAllAgent,
    updateAgent,
    deleteAgent,
}