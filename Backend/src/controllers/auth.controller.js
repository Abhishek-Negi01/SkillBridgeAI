const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/dotenv.js");
const tokenBlacklistModel = require("../models/blacklist.model.js");

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in request body.
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "please provide username,email and password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "username or email already taken",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body.
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutUserController
 * @description logout a user by removing token from cookie and add token into blacklist.
 * @access Public
 */
async function logoutUserController(req, res) {
  const token = req.cookies?.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  } else {
    return res.status(404).json({
      message: "token not found",
    });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "user logged out successfully",
  });
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access Private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user?.id); // in jwt we use id : _id

  res.status(200).json({
    message: "user details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
