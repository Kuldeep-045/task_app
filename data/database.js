import mongoose from "mongoose";


export const connectDb=()=>{
    mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "task",
    })
    .then((c) => console.log(`DB COnnect ${c.connection.host}`))
    .catch((e) => console.log(e))
}