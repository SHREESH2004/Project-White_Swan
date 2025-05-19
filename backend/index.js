import app from "./app.js";
import { ServerConfig ,logger} from "./config/index.js";
const Port=process.env.PORT;
app.listen(ServerConfig.PORT, () => {
    console.log("Server running on port",Port);
    logger.info("Successfully started the server");
});