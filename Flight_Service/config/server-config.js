import { configDotenv } from "dotenv";
configDotenv();

export const ServerConfig = {
    PORT: process.env.PORT
};
