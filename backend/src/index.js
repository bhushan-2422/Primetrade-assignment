import { app } from "./app.js";
import dotenv from "dotenv";
import connect_db from "./db/index.js";

connect_db()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("app is listening on port ",process.env.PORT || 8000)
    })
})
.catch((e)=>{
    console.log("mongo db connection failed: ",e)
})