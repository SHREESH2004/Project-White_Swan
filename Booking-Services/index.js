import app from "./app.js";
import { configDotenv } from "dotenv";
configDotenv();

const Port=process.env.PORT;
app.listen(Port,async () => {
    console.log("Server running on port",Port);
   /* try {
        const city = await db.City.findByPk(16); 
        const airport=await city.createAirport({name:'Netaji Subhas Airport',code:'NSC1',address:city.name})
        console.log(airport) // ✅ Correct usage
        if (city) {
            logger.info(`Fetched city: ${city.name}`);
        } else {
            logger.warn("City with ID 7 not found.");
        }
    } catch (error) {
        logger.error("Error fetching city:", error);
    }*/


});