const { User } = require("../models/user-models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//here we created two middleware first to validate the token and the second to check user exist and send its credintials

exports.ValidateToken = async (req, res, next) => {
  try {
    //verify a token
    if (req.headers["x-access-token"]) {
      const accessToken = req.headers["x-access-token"];
      const { _id, email } = jwt.verify(accessToken, process.env.DB_TOKEN);
      console.log(`your email is verified and it is ${email}`);
      res.locals.userData = await User.findById(_id);

      next();
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Error", error: error });
    next(error);
  }
};

exports.CheckUserExist = (req, res, next) => {
  const user = res.locals.userData;
  if (!user) return res.status(401).json({ message: "user doesn't exist", error: error });
  req.user = user;
  next();
};
