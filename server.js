const express = require("express");
require("dotenv").config();
const { env } = require("process");

// router
const appRouter = require("./routes");
const User = require("./models/user");

const app = express()
const port = process.env.PORT || 3000



app.use(express.json());

app.use("/api/v1", appRouter);


app.listen(port, () => {
    console.log(`Server Running: ${port}`,)
})