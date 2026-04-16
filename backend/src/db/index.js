import mongoose from "mongoose"
import { db_name } from "../constant.js"


const connect_db = async() =>{
    console.log(db_name)
    try{
        const instance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log("mongo db connection instance: ",instance.connection.host)
    }catch(e){
        console.log("MONGO DB CONNECTION FAILED WITH ERR: ",e)
    }
}

export default connect_db