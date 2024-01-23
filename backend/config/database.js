import mongoose from "mongoose";


let URI = 'mongodb://localhost:27017/Authentication';
export const connectToDB = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log('Connection to Database successful.')
    } catch (error) {
        console.log('Connection to Database failed.')
        console.log('\n', error)
    }
}