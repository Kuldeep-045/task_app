import {app} from "./app.js"

import { connectDb } from "./data/database.js";
connectDb()

app.listen(process.env.PORT, () => {
    console.log(`server is working on port:${process.env.PORT}`);
})