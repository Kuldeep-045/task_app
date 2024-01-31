import express from "express"
import { User } from "../models/user.js";
import ErrorHandler from "../middlewares/error.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const router = express.Router()

const sendCookies = (user, res, message, statusCode) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        })
        .json({
            success: true,
            message,
        });
};
router.post("/signup", async (req, res, next) => {
    try {
        // Check if the user already exists
        const { phone_number, email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            // User already exists
            const error = new ErrorHandler("User Already Exists", 400);
            return next(error)
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({ phone_number, email, password: hashedPassword });

        // Send response
        sendCookies(user, res, "Registered Successfully", 201);
    } catch (error) {
        // Pass the error to the error middleware
        return next(new ErrorHandler("Internal Server Error", 500));
    }
});


router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            const error = new ErrorHandler("Invalid Email or Password", 404);
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new ErrorHandler("Invalid Email or Password", 401);
            return next(error);
        }

        // Successful login
        sendCookies(user, res, `Welcome back`, 200);
    } catch (error) {
        // Pass the error to the error middleware
        return next(new ErrorHandler("Internal Server Error", 500));
    }
});


router.get("/logout", (req, res) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            maxAge: 1000 * 60 * 15,
        })
        .json({
            success: true,
            user: req.user,
        });

})

// router.get("/me",isAuthenticated, getMyProfile)


export default router