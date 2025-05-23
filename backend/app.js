import e from "express";
import v1Routes from "./routes/v1.routes.js";
import v2Routes from "./routes/v2.routes.js";
const app = e();
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use('/v1',v1Routes);
app.use('/v2',v2Routes);
export default app;
