import e from "express";
import { configDotenv } from "dotenv";
const app = e();
configDotenv();
const Port=process.env.PORT;
app.listen(Port, () => {
    console.log("Server running on port",Port);
});