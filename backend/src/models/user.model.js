import mongoose, { Mongoose } from "mongoose";

export const userSchema = mongoose.Schema({
    username: {type: String, required: true}, 
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    loggedInWith: {type: String, default: "Local Account"},
    passresetToken: {type: String, default: null},
    passResetTokenExpiry: {type: Date, default: Date.now}
});


export const UserModel = new mongoose.model('User', userSchema);