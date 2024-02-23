const Agent = require('../Model/UserModel');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require("bcryptjs");

const ROLES = require('../Config/constConfig')

const createAgent = async (req, res) => {
    try {
        const foundAgent = await Agent.findOne({ email: req.body.email })
        if (foundAgent) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: `${foundAgent.fullName} already exists.` });
        }
        const agent = new Agent({
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            userType: req.body.userType,
        })
        await agent.save()
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${agent.fullName} was registered successfully!` });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
}



const getAllAgent = async (req, res) => {
    try {
        const agents = await Agent.find({ userType: { $in: [ROLES.RPA, ROLES.RTA] } })
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


    const updateAgent = async (req, res) => {
        try {

            if (!req.body.email || !req.body.userType) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Please provide an email and a position !" });
            }

            const update = { email: req.body.email, userType: req.body.userType, updatedAt: new Date() };
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
            res.status(StatusCodes.OK).json({ updatedAgent });
        } catch (error) {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send({ message: error.message });
        }
    };



    const deleteAgent = async (req, res) => {
        try {

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