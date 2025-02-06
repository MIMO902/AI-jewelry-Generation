import User from '../models/user.model.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt"; 

const saltRounds = 10;

const validation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]+$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("pages/signup", {
      title: "Signup page - Validation Failed",
      errors: errors.array(),
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);
    const existingUser = await User.findOne({ username: req.body.username });
    const existingemail = await User.findOne({ email: req.body.email });

    if (existingemail) {
      console.log("Email already exists");
      res.send("Email already exists");
    }else if(existingUser){
      console.log("username already exists");
      res.send("username already exists");
    } else {
      const newUser = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        type:req.body.type,
      });

      await newUser.save().then(result =>{
        req.session.user=result;

      })


      console.log("User saved successfully");
      res.redirect('/user/Home');
    }
  } catch (error) {
    console.log(error);
    res.send("An error occurred");
  }
};

const login = async (req, res, next) => {
 
  const existinguser = await User.findOne({ username: req.body.logusername });
  if(existinguser){
    const hashePassword =await bcrypt.compare(req.body.logpassword, existinguser.password);
    if(hashePassword){
      req.session.user=existinguser;
      if(req.session.user.type=='admin'){
       res.redirect('/admin');
      }else{
      console.log("User loged in successfully");
      res.redirect('/user/Home');
      }
    }else{
      console.log("password is not correct");
      res.send("password is not correct");
    }
  }else{
    console.log("username does not exists");
     res.send("username does not exists");
  }

};

const checkUN = async (req, res) => {
  var query = { username: req.body.username };
  User.find(query)
      .then(result => {
          if (result.length > 0) {
              res.send(' taken');
          }
          else {
              res.send(' available');
          }
      })
      .catch(err => {
          console.log(err);
      });
};

const checkEmail = async (req, res) => {
  var query = { email: req.body.email };
  User.find(query)
      .then(result => {
          if (result.length > 0) {
              res.send('taken');
          }
          else {
              res.send('available');
          }
      })
      .catch(err => {
          console.log(err);
      });
};

export {
  signup,
  validation,
  login,
  checkUN,
  checkEmail,
}