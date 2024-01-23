import { UserModel } from "../models/user.model.js";

export default class UserRepository{

    async loginRepo(email, password){
        try {
            const userExists = await UserModel.findOne({email: email});
            if(!userExists){
                throw new Error("No user with provided email exists.")
            }
            if(userExists.password !== password){
                throw new Error("Incorrect credentials.")
            }
            return userExists;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async registerRepo(data){
        try {
            const newUser = await new UserModel({
                username: data.username,
                email: data.email,
                password: data.password
            });

            await newUser.save();
            return newUser;
        } catch (error) {
            console.log(error);
        }
    }

    async resetPassword(userId, email, password){

    }

    async forgotPassword(userId, email, resetToken){

    }
}