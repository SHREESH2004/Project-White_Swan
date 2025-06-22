import express from "express";
import WhiteRoutes from "./routes/White.routes.js";

const app = express();  // Create the main app here ONLY once

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/WhiteSwan", WhiteRoutes);

export default app;
