const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const ROLES = require('../Config/ConstConfig')
const { passwordIsValid, validUserType, generateToken } = require("../Service/AuthService");

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide an email and password !" });
        }
        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "user does not exist." });
        }
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            userType: req.body.userType,
        });

        if (!passwordIsValid(req.body.password, foundUser.password)) {
            return res.status(StatusCodes.UNAUTHORIZED).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }
        const userTypeIsValid = validUserType(foundUser.userType);

        if (!userTypeIsValid) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "User does not have permission to connect." });
        }
        const token = generateToken(foundUser.id, foundUser.userType);
        res
            .status(StatusCodes.ACCEPTED)
            .json({ message: "User logged in successfully.", accessToken: token });
    } catch (error) {
        console.error(error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error during the authentication." });
    }
};


const register = async (req, res) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email });
        if (foundUser) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "User already exists." });
        }

        if (req.body.userType != ROLES.RA) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: "User does not have permission to register" });
        }
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            userType: req.body.userType,
        });

        await user.save();
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: "User was registered successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};


module.exports = { login, register }