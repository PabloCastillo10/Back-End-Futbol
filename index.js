import { config } from "dotenv";
import { initServer } from "./config/server.js";

config(); //PRIMERO CARGAR DOTENV
initServer(); // INICIAR SERVIDOR