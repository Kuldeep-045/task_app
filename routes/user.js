import express, { Router } from "express"
import { User } from "../models/user.js";
// import { isAuthenticated } from "../middlewares/auth.js";

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
            maxAge: 1000 * 60 * 15,
        })
        .json({
            success: true,
            message,
        });
};

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    console.log(email);
    if (userExist) {
        res.send("User already exist")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    sendCookies(user, res, "Registered Successfully", 201);
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        res.send("User Not find")
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.send("USER NOT FIND")
    }


    sendCookies(user, res, `Welcome back, ${user.name}`, 200);
})

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