import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    phone_number: {
        type: Number,
        required: true, // You might want to add this if email is a required field
    }, 
    email: {
        type: String,
        unique: true,
        required: true, // You might want to add this if email is a required field
    }, 
    password: {
        type: String,
        required: true,
        select:false, // You might want to add this if email is a required field
    },
    createdAt: {
        type: String,
        default: new Date().toLocaleDateString('en-IN'),
    }
});

export const User= mongoose.model("User", schema);