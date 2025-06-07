import app from "./app.js";
import { ServerConfig ,logger} from "./config/index.js";
import db from "./models/index.js";

const Port=process.env.PORT;
app.listen(ServerConfig.PORT,async () => {
    console.log("Server running on port",Port);
    logger.info("Successfully started the server");
    try {
        const city = await db.City.findByPk(8);  // ✅ Correct usage
        if (city) {
            logger.info(`Fetched city: ${city.name}`);
        } else {
            logger.warn("City with ID 7 not found.");
        }
    } catch (error) {
        logger.error("Error fetching city:", error);
    }



});