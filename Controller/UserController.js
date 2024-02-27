
const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { passwordIsValid, validUserType, generateToken } = require("../Service/AuthService");
const ROLES = require('../Config/ConstConfig')

// const login = async (req, res) => {
//   try {
//     if (!req.body.email || !req.body.password) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Please provide an email and password !" });
//     }
//     const foundUser = await User.findOne({ email: req.body.email });
//     if (!foundUser) {
//       return res
//         .status(StatusCodes.UNAUTHORIZED)
//         .json({ message: "user does not exist." });
//     }
//     const user = new User({
//       email: req.body.email,
//       password: req.body.password,
//       userType: req.body.userType,
//     });

//     if (!passwordIsValid(req.body.password, foundUser.password)) {
//       return res.status(StatusCodes.UNAUTHORIZED).send({
//         accessToken: null,
//         message: "Invalid Password!",
//       });
//     }
//     const userTypeIsValid = validUserType(foundUser.userType);

//     if (!userTypeIsValid) {
//       return res
//         .status(StatusCodes.UNAUTHORIZED)
//         .json({ message: "User does not have permission to connect." });
//     }
//     const token = generateToken(foundUser.id, foundUser.userType);
//     res
//       .status(StatusCodes.ACCEPTED)
//       .json({ message: "User logged in successfully.", accessToken: token });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "Error during the authentication." });
//   }
// };


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


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const data = users.map((user) => {
      return {
        fullName: user.fullName,
        email: user.email,
        job: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    res.status(StatusCodes.ACCEPTED).json({ users: data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};


const getUserByEmail = async (req, res) => {
  const userEmail = req.params.email;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
  res.status(StatusCodes.OK).json({ user });
};


const UpdateUser = async (req, res) => {
  try {
    if (!req.body.email || !req.body.userType) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide an email and a position !" });
    }

    const update = { email: req.body.email, userType: req.body.userType };
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      update,
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });
    }
    res.status(StatusCodes.OK).json({ updatedUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {

    const userEmail = req.params.email;
    const user = await User.findOneAndDelete({ email: userEmail })
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });

    }
    res.status(StatusCodes.OK).json({ message: "User was deleted successfully!" });


  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}
module.exports = {getAllUsers, getUserByEmail, UpdateUser, deleteUser };
