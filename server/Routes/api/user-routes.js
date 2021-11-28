const express = require("express");
let router = express.Router();
require("dotenv").config();
const { User } = require("../../models/user-models");
const { grantAccess } = require("../../middleware/roles");

const {CheckUserExist} = require("../../middleware/auth")

router.route("/register").post(async (req, res) => {
  try {
    ///1 check if email taken
    if (await User.emailTaken(req.body.email)) {
      return res.status(400).json({ message: "Sorry email taken" }); //if email taken kill the process with this return
    }

    /// 2 creating the model ( hash password)
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
    });

    /// 3 generate token
    const token = user.GenerateToken();
    const doc = await user.save();

    // 4 send email

    // save...send token with cookie
    res
      .cookie("x-access-token", token)
      .status(200)
      .send({
        email: doc.email,
        username: doc.firstname + " " + doc.lastname,
        firstname : doc.firstname ,
        lastname :doc.lastname,
        role : doc.role,
        age: doc.age,
      });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error });
  }
});

router.route("/signin").post(async (req, res) => {
  try {
    //find user
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ message: "enter a valid email or signUp first " }); //return to kill the process else compare password

    //compare password
    const compare = await user.deCryptPassword(req.body.password);
    if (!compare)
      return res
        .status(400)
        .json({ message: "password not valid for this email " }); //return to kill the process else generate token

    //generte token
    const token = user.GenerateToken();

    //response
    res
      .cookie("x-access-token", token)
      .status(200)
      .send({
        email: user.email,
        username: user.firstname + " " + user.lastname,
        firstname : user.firstname ,
        lastname :user.lastname,
        age: user.age,
        role : user.role

      });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error });
  }
});

router
  .route("/profile")
  .get(CheckUserExist, grantAccess("readOwn", "profile"), async (req, res) => {
    const permission = res.locals.permission;
    res.json(permission.filter(req.user._doc));
  })
  .patch(CheckUserExist , grantAccess("updateOwn", "profile"), async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
          },
        },
        {
          new: true,
        }
      );
      if (!updatedUser) return res.status(401).json("please sign in");
      const permission = res.locals.permission;
      res.json(permission.filter(updatedUser._doc));
    } catch (error) {
      res.status(401).json({
        message: "can't update profile",
        error: error,
      });
    }
  });

router.route("/update-email")
  .patch(CheckUserExist ,  grantAccess("updateOwn", "profile") , async(req,res)=>{
      try {
          if(await User.emailTaken(req.body.newemail)){
              return res.status(401).json({message : "sorry email taken"})
          }
          const updatedUser = await User.findOneAndUpdate(
          {
            _id: req.user._id,
            email : req.body.email //we take the email so we make the user enters the email before updating it
          },
          {
             $set: {
               email : req.body.newemail
             }
           },
          {new:true}
          )
          if(!updatedUser) return res.status(400).json({message : "user not found"})
          const token = User.GenerateToken ;
          res.cookie("x-access-token" , token)
          .status(200).send({email : updatedUser.email})
          

      } catch (error) {
        res.status(401).json({
            message: "can't update profile",
            error: error,
          });
          
      }
  })

router.route('/isauthed') //in the front end we will pass a header token to check user authed or not
.get(CheckUserExist , async (req,res) =>{
    res.status(200).json({
      email : req.user.email,
      firstname : req.user.firstname,
      lastname : req.user.lastname,
      age : req.user.age
    })
})


module.exports = router;
