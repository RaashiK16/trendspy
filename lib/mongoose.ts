import mongoose from "mongoose";

let isConnected = false; //variable to track the connectrion status

export const connectToDB = async()=>{
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URI)
        return console.log("MONGODB_URI is not defined");

    if(isConnected)
        return console.log("Using existing database connection")

    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS:50000,
            socketTimeoutMS:60000,
        })
        
        isConnected=true;
        console.log("Mongodb connected");
    } catch (error) {
        console.log("Error - ",error)
    }
}