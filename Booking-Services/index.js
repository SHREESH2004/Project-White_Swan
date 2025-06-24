import app from "./app.js";
import { configDotenv } from "dotenv";
configDotenv();

import schedule_Crons from "./utils/common/cron-jobs.js";

const Port = process.env.PORT;

app.listen(Port, async () => {
    console.log("Server running on port", Port);
    schedule_Crons(); 
});
