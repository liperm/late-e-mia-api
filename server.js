import 'dotenv/config';
import express from "express";
import { getUserRoutes, getAuthRoutes } from "./src/api.js";
import cors from "cors";

const corsOprions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionSuscessStatus: 200,
}

const app = express();
app.use(express.json());
app.use(cors(corsOprions));

getUserRoutes(app);
getAuthRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});