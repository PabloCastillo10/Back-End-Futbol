import gameModel from "../game/game.model.js";
import teamsModel from "../teams/teams.model.js";
import noticiasModel from "../noticias/noticias.model.js";
import authModel from "../auth/auth.model.js";
import leagueModel from "../league/league.model.js";
//Endpoint para proximos partidos

export const getUpcomingGames = async (req, res) => {
    try {
        const ahora = new Date();
        const games = await gameModel.find({
            FechaHora: { $gt: ahora },
        })
            .sort({ FechaHora: 1 }) // más proximos primero
            .limit(5)
            .populate("league", "name")
            .populate("equipoLocal", "name imagen estadio")
            .populate("equipoVisitante", "name imagen");

        res.status(200).json({
            success: true,
            message: "Listado de partidos próximos",
            games
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener los partidos próximos",
            error: error.message
        })
    }
}

//Endpoint para estadisticas rapidas

export const getDashboardStats = async (req, res) => {
    try {
        const ahora = new Date();
        const inicioHoy = new Date(ahora.setHours(0, 0, 0, 0));
        const finHoy = new Date(ahora.setHours(23, 59, 59, 999));

        const partidosEnVivo = await gameModel.countDocuments({
            FechaHora: { $lte: new Date() },
            golesLocal: null,
            golesVisitante: null
        })

        const partidosHoy = await gameModel.countDocuments({
            FechaHora: { $gte: inicioHoy, $lte: finHoy },
        })

        const ligasActivas = await gameModel.distinct("league", {
            FechaHora: { $gte: inicioHoy },
        })

        const noticias = await noticiasModel.countDocuments();

        const equipos = await teamsModel.countDocuments();

        const usersRoleClient = await authModel.countDocuments({
            role: "USER"
        })

        res.status(200).json({
            success: true,
            message: "Estadisticas del usuario",
            partidosEnVivo,
            partidosHoy,
            ligasActivas: ligasActivas.length,
            equipos,
            noticias,
            usersRoleClient
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las estadisticas del usuario",
            error
        })
    }
}

//Endpoint de Actividad Reciente

export const getRecentActivity = async (req, res) => {
    try {
        //Traer ultimos registros de distintos modelos
        const games = await gameModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("equipoLocal equipoVisitante league", "name")

        const leagues = await leagueModel.find()
            .sort({ createdAt: -1 })
            .limit(5)

        const teams = await teamsModel.find()
            .sort({ createdAt: -1 })
            .limit(5)

        const noticias = await noticiasModel.find()
            .sort({ createdAt: -1 })
            .limit(5)

        //Mapear todo a un mismo formato
        const activity = [
            ...games.map(g => ({
                type: "game",
                action: `Partido creado: ${g.equipoLocal.name} vs ${g.equipoVisitante.name}`,
                time: g.createdAt,
            })),

            ...leagues.map(l => ({
                type: "league",
                action: `Liga creada: ${l.name}`,
                time: l.createdAt,
            })),

            ...teams.map(t => ({
                type: "team",
                action: `Equipo creado: ${t.name}`,
                time: t.createdAt,
            })),

            ...noticias.map(n => ({
                type: "news",
                action: `Noticia creada: ${n.titulo}`,
                time: n.createdAt,
            })),
        ];

        //Ordenar por fecha descendente
        activity.sort((a, b) => b.time - a.time);

        //Limitar a 10 elementos
        res.status(200).json({
            success: true,
            message: "Actividad reciente",
            activity: activity.slice(0, 10)
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la actividad reciente",
            error
        })
    }
}

//Endpoint para ligas principales

export const getTopLeagues = async (req, res) => {
    try {

        const topLeagues = await gameModel.aggregate([
            { $group: { _id: "$league", matches: { $sum: 1 } } }, //El $group sirve para agrupar los datos
            { $sort: { matches: -1 } }, //El $sort sirve para ordenar los datos
            { $limit: 5 } //El $limit sirve para limitar los datos
        ]);

        //Poblar informacion de la liga
        const leagues = await leagueModel.find({ _id: { $in: topLeagues.map(l => l._id) } })

        const result = await Promise.all(
            topLeagues.map(async (l) => {
                const leagueInfo = leagues.find(
                    (x) => x._id.toString() === l._id.toString()
                );

                // contar equipos de esa liga
                const teamCount = await teamsModel.countDocuments({
                    league: leagueInfo._id
                });

                return {
                    id: leagueInfo._id,
                    name: leagueInfo?.name || "Liga sin nombre",
                    matches: l.matches,
                    teams: teamCount,
                    status: leagueInfo?.status || "activo"
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Ligas principales",
            topLigas: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error al obtener las ligas principales",
            error: error.message
        })
    }
}