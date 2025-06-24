import express from "express";
import UserRoutes from "./routes/User.routes.js"
import cookieParser from 'cookie-parser';
const app = express();  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/users', UserRoutes);

export default app;
