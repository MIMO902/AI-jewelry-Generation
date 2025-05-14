import User from "../models/user.model.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

const saltRounds = 10;

class UserController {
    constructor() {
        this.validation = [
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
    }

    async signup(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msg = encodeURIComponent(errors.array().map(e => e.msg).join(' | '));
            return res.redirect(`/signup?error=${msg}`);
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const existingUser = await User.findOne({ username: req.body.username });
            const existingEmail = await User.findOne({ email: req.body.email });

            if (existingEmail) {
                return res.redirect("/signup?error=" + encodeURIComponent("Email already exists"));
            }
            if (existingUser) {
                return res.redirect("/signup?error=" + encodeURIComponent("Username already exists"));
            }

            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                type: req.body.type,
            });

            const result = await newUser.save();
            req.session.user = result;
            console.log("User saved successfully");
            res.redirect("/user/Home");
        } catch (error) {
            console.error(error);
            res.redirect("/signup?error=" + encodeURIComponent("An error occurred"));
        }
    }


    async login(req, res) {
        try {
            const existingUser = await User.findOne({ username: req.body.logusername });
            if (!existingUser) {
                return res.redirect("/login?error=Username%20does%20not%20exist");
            }

            const isPasswordValid = await bcrypt.compare(req.body.logpassword, existingUser.password);
            if (!isPasswordValid) {
                return res.redirect("/login?error=Wrong%20password");
            }

            req.session.user = existingUser;
            res.redirect(existingUser.type === "admin" ? "/admin" : "/user/Home");
        } catch (error) {
            console.error(error);
            res.send("An error occurred");
        }
    }

    async checkUN(req, res) {
        try {
            const result = await User.find({ username: req.body.username });
            res.send(result.length > 0 ? "taken" : "available");
        } catch (error) {
            console.error(error);
            res.send("Error checking username");
        }
    }

    async checkEmail(req, res) {
        try {
            const result = await User.find({ email: req.body.email });
            res.send(result.length > 0 ? "taken" : "available");
        } catch (error) {
            console.error(error);
            res.send("Error checking email");
        }
    }
}

export default new UserController();
