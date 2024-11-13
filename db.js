const mongoose=require("mongoose")
const uri=process.env.DATABASE_URI;

const connectdb=async()=>{
    try {
        await mongoose.connect(uri);
        console.log("connection successfull to DB")
    } catch (error) {
        console.log("database connection failed")
        process.exit(0)
    }
};
module.exports=connectdb;