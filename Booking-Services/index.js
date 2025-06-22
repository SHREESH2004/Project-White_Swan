import app from "./app.js";
import { configDotenv } from "dotenv";
configDotenv();

const Port = process.env.PORT;
app.listen(Port, async () => {
    console.log("Server running on port", Port);


});