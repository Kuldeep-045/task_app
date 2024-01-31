import express from "express"

import subTaskRouter from "./routes/subTask.js"
import taskRouter from "./routes/task.js"
import userRouter from "./routes/user.js"
import {errorMiddleware} from "./middlewares/error.js"

import { config } from "dotenv"
import cookieParser from "cookie-parser";


export const app = express();
import { Task } from "./models/task.js";
import { SubTask } from "./models/subTask.js";
config({
    path: "./data/config.env",
})

//using middlewear
app.use(express.json())
app.use(cookieParser())


app.use("/subtask",subTaskRouter)
app.use("/task",taskRouter)
app.use("/user",userRouter)



app.get("/", (req, res) => {
    res.send("Nice working");
})





app.all("/*", async (req, res) => {
    res.send("error")

})

app.use(errorMiddleware);
app.use((err,req,res,next)=>{
    return res.json(
        err
    )
})