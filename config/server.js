import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { dbConnection } from "./mongo.js";
import express from "express";
import authRoutes from "../src/auth/auth.routes.js";
import leagueRoutes from "../src/league/league.routes.js";
import teamsRoutes from "../src/teams/teams.routes.js"
import gamesRoutes from "../src/game/game.routes.js"
import { createAdmin } from "../src/auth/auth.controller.js";
const configMiddleware = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors())
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const configurarRutas = (app) => {
    app.use("/deportes/auth", authRoutes);
    app.use("/deportes/league", leagueRoutes);
    app.use("/deportes/teams", teamsRoutes);
    app.use("/deportes/games", gamesRoutes);
}

const connectionDB = async () => {
    try {
        await dbConnection();
        console.log('Conexion a la base de datos exitosa');
        await createAdmin();
    } catch (error) {
        console.log('Error al conectar a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;
    await connectionDB();
    configMiddleware(app);
    configurarRutas(app);
    app.listen(port, () => {
        console.log(`Servidor corriendo en el puerto ${port}`);
    });
}