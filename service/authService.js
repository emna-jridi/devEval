const config = require("../Config/AppConfig");
const ROLES = require("../Config/ConstConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../Config/AppConfig");
const { StatusCodes } = require("http-status-codes");

// Function to check if the provided plain password matches the hashed password
const passwordIsValid = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

// Function to validate user type
const validUserType = (userType) => {
  const allowedUserTypes = [ROLES.RA, ROLES.RPA, ROLES.RTA];
  return allowedUserTypes.includes(userType);
};


// Function to generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign({ id: userId, userType: userType }, config.secret, {
    algorithm: "HS256",
    expiresIn: 3600,
  });
};


// Middleware function to authorize user based on role
const authorization = (role)=> async (req, res, next) => {

  try {
  // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
 // Verify and decode token
    const decoded = jwt.verify(token, Config.secret);
    const { id, userType } = decoded;
    // Check if user type matches the required role
    if (userType !== role) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to access this resource." });
    }
 // Set user information in request object
    req.user = { userId: id, userType };

// Call next middleware
    next();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error during the authentication." });
  }
};
const authorizationAdmin = authorization(ROLES.RA);
const authorizationRTA = authorization(ROLES.RTA);
const authorizationRPA = authorization(ROLES.RPA);

module.exports = {
  passwordIsValid,
  validUserType,
  generateToken,
  authorizationAdmin,
  authorizationRTA,
  authorizationRPA ,
};
