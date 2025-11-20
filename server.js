import 'dotenv/config';
import express from "express";
import { getUserRoutes, getAuthRoutes, getAppointmentRoutes } from "./src/api.js";
import cors from "cors";
import cookieParser from "cookie-parser";


const corsOprions = {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  optionSuscessStatus: 200,
  credentials: true,
}

const app = express();
app.use(express.json());
app.use(cors(corsOprions));
app.use(cookieParser());


getUserRoutes(app);
getAuthRoutes(app);
getAppointmentRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});