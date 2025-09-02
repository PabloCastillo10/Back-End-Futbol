import gameModel from "./game.model.js";
import teamModel from "../teams/teams.model.js";
import leagueModel from "../league/league.model.js";
import { validarPermisos } from "../helpers/db-validator.js";
import tableModel from "../table/table.model.js";

export const createGame = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;
        await validarPermisos(req)

        const league = await leagueModel.findOne({ name: data.league });
        if (!league) {
            return res.status(404).json({ message: "La liga no existe" });
        }

        const equipoLocal = await teamModel.findOne({ name: data.equipoLocal });
        if (!equipoLocal) {
            return res.status(404).json({ message: "El equipo local no existe" });
        }

        const equipoVisitante = await teamModel.findOne({ name: data.equipoVisitante });
        if (!equipoVisitante) {
            return res.status(404).json({ message: "El equipo visitante no existe" });
        }

        if (equipoLocal._id.equals(equipoVisitante._id)) {
            return res.status(400).json({ message: "Un equipo no puede jugar contra sí mismo" });
        }

        const partidoCreado = await gameModel.findOne({ league: league._id, equipoLocal: equipoLocal._id, equipoVisitante: equipoVisitante._id });
        if (partidoCreado) {
            return res.status(400).json({ message: "El partido ya existe" });
        }

        const nuevoPartido = new gameModel({
            FechaHora: data.FechaHora,
            jornada: data.jornada,
            estadio: equipoLocal._id,
            league: league._id,
            equipoLocal: equipoLocal._id,
            equipoVisitante: equipoVisitante._id
        })
        await nuevoPartido.save();

        const PartidoGuardado = await gameModel.findById(nuevoPartido._id)
            .populate("league", "name")
            .populate("equipoLocal", "name estadio")
            .populate("equipoVisitante", "name")

        res.status(200).json({
            success: true,
            message: "Partido creado correctamente",
            partido: PartidoGuardado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar crear el partido",
            error: error.message
        })
    }
}


export const getGames = async (req, res) => {
    try {
        const games = await gameModel.find()
            .populate("league", "name")
            .populate("equipoLocal", "name estadio")
            .populate("equipoVisitante", "name");

        res.status(200).json({
            success: true,
            message: "Listado de partidos",
            games: games
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener los partidos",
            error: error.message
        })
    }
}


export const getGameByName = async (req, res) => {
    try {
        const { equipoLocal } = req.params;
        //Buscar el equipo por su nombre
        const team = await teamModel.findOne({ name: equipoLocal })


        if (!team) {
            return res.status(404).json({
                success: false,
                message: `No existe un equipo con el nombre ${equipoLocal}`
            });
        }
        //Buscar partidos donde el equipo local o el visitante coincida con el nombre del equipo
        const games = await gameModel.find({ //CHATGPT CODIGO GENERADO
            $or: [ //$ or es un operador que permite que se busquen partidos donde el equipo local o el visitante coincida con el nombre del equipo
                { equipoLocal: team._id },
                { equipoVisitante: team._id }
            ]
        })
            .populate("league", "name")
            .populate("equipoLocal", "name estadio")
            .populate("equipoVisitante", "name");

        if (!games || games.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No se han encontrado partidos del equipo ${equipoLocal}`
            });
        }

        const count = await gameModel.countDocuments({
            $or: [
                { equipoLocal: team._id },
                { equipoVisitante: team._id }
            ]
        });
        res.status(200).json({
            success: true,
            message: "Partidos encontrados correctamente",
            total: count,
            games
            
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener los partidos de este equipo",
            error: error.message
        })
    }
}

export const listGameByLeague = async (req, res) => {
    try {
        const { league } = req.params;
        const leagueDoc = await leagueModel.findOne({ name: league })
        
        const games = await gameModel.find({ league: leagueDoc._id })
        .populate("equipoLocal", "name")
        .populate("equipoVisitante", "name");

        const count = await gameModel.countDocuments({ league: leagueDoc._id });
        res.status(200).json({
            success: true,
            message: "Listado de partidos",
            total: count,
            games: games
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener los partidos",
            error: error.message
        })
    }
}

export const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await validarPermisos(req);

        const updateData = { ...data };

        const gameUpdated = await gameModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate("league", "name")
            .populate("equipoLocal", "name estadio")
            .populate("equipoVisitante", "name")

        res.status(200).json({
            success: true,
            message: "Partido actualizado correctamente",
            gameUpdated
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar actualizar el partido",
            error: error.message
        })
    }
}

export const getSearchJornada = async (req, res) => {
    try {
        const {jornada, league} = req.params;

        const leagueDoc = await leagueModel.findOne({ name: league })

        const leagueId = leagueDoc._id;
        const games = await gameModel.find({ jornada: jornada, league: leagueId })
            .populate("league", "name")
            .populate("equipoLocal", "name")
            .populate("equipoVisitante", "name");

        const count = await gameModel.countDocuments({ jornada: jornada });
        res.status(200).json({
            success: true,
            message: "Listado de partidos",
            total: count,
            games
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener los partidos",
            error: error.message
        })
    }
}


export const createGameResult = async (req, res) => {
    try {
        const { id } = req.params;
        let {golesLocal, golesVisitante} = req.body;

        golesLocal = Number(golesLocal);
        golesVisitante = Number(golesVisitante);
        await validarPermisos(req);

        const gameResult = await gameModel.findByIdAndUpdate(
            id,
            {golesLocal, golesVisitante},
            { new: true }
        )

        .populate("league", "name")
            .populate("equipoLocal", "name")
            .populate("equipoVisitante", "name")

        if (!gameResult) {
            return res.status(404).json({
                success: false,
                message: "No se ha encontrado el partido"
            });
        }
        

        const updateTable = async (teamId, leagueId, golesAFavor, golesEnContra, resultado) => {
            let table = await tableModel.findOne({ team: teamId, league: leagueId });
            if (!table) {
                table = new tableModel({team: teamId, league: leagueId});
            }
            table.partidosJugados += 1;
            table.golesAFavor += golesAFavor;
            table.golesEnContra += golesEnContra;
            table.diferenciaGoles = table.golesAFavor - table.golesEnContra;

            if (resultado === "ganador") {
                table.partidosGanados += 1;
                table.puntos += 3;
            } else if (resultado === "empatado") {
                table.partidosEmpatados += 1;
                table.puntos += 1;
            } else if (resultado === "perdido") {
                table.partidosPerdidos += 1;
                table.puntos += 0;
            }
            await table.save();
        }

        if (gameResult.golesLocal !== null && gameResult.golesVisitante !== null) {
            return res.status(400).json({
                success: false,
                message: "Este partido ya tiene resultado registrado"
            });
        }

        if (golesLocal > golesVisitante) {
            await updateTable(gameResult.equipoLocal, gameResult.league, golesLocal, golesVisitante, "ganador");
            await updateTable(gameResult.equipoVisitante, gameResult.league, golesVisitante, golesLocal, "perdido");
        } else if (golesLocal < golesVisitante) {
            await updateTable(gameResult.equipoLocal, gameResult.league, golesLocal, golesVisitante, "perdido");
            await updateTable(gameResult.equipoVisitante, gameResult.league, golesVisitante, golesLocal, "ganador");
        } else {
            await updateTable(gameResult.equipoLocal, gameResult.league, golesLocal, golesVisitante, "empatado");
            await updateTable(gameResult.equipoVisitante, gameResult.league, golesVisitante, golesLocal, "empatado");
        }
        res.status(200).json({
            success: true,
            message: "Resultado del partido creado correctamente",
            gameResult: gameResult
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar crear el resultado del partido",
            error: error.message
        })
    }
}

export const getTableLeague = async (req, res) => {
    try {
        const { league } = req.params;
        const leagueDoc = await leagueModel.findOne({ name: league })

        const leagueId = leagueDoc._id;

        let table = await tableModel.find({ league: leagueId })
            .populate("team", "name imagen estadio")
            .populate("league", "name")
            .sort({
                puntos: -1, //primero mas puntos
                diferenciaGoles: -1, //diferencia de goles
                golesAFavor: -1 //si empata, mas goles a favor
            })

            // para que se añada la posicion en la tabla
            table = table.map((item, index) => ({
            posicion: index + 1, // empieza desde 1
            ...item.toObject()   // convertir a objeto plano
            }));

            res.status(200).json({
                success: true,
                message: "Tabla de clasificacion",
                table
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener la tabla",
            error: error.message
        })
    }
}

export const getTableLeagueByTeam = async (req, res) => {
    try {
        const { league, team } = req.params;
        const leagueDoc = await leagueModel.findOne({ name: league })
        const teamDoc = await teamModel.findOne({ name: team })

        const leagueId = leagueDoc._id;
        const teamId = teamDoc._id;

        const table = await tableModel.find({ league: leagueId, team: teamId })
            .populate("team", "name imagen estadio")
            .populate("league", "name")
            .sort({
                puntos: -1, //primero mas puntos
                diferenciaGoles: -1, //diferencia de goles
                golesAFavor: -1 //si empata, mas goles a favor
            })

        res.status(200).json({
            success: true,
            message: "Tabla de clasificacion",
            table
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener la tabla",
            error: error.message
        })
    }
}