import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        userId:{
            type: String
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type:String,
            required: true
        },
        completed:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Task = mongoose.model("Task", taskSchema)