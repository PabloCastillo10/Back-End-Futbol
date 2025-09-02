
import leagueModel from "../league/league.model.js";
import teamModel from "../teams/teams.model.js";

export const validarPermisos  = async (req) => {
    const user = req.user;

    if(user.role !== "ADMIN") {
        throw new Error("No tienes permisos para realizar esta acción")
    }
}

export const validarExistenciaLiga = async (id = '') => {
    const liga = await leagueModel.findById(id);

    if (!liga) {
        throw new Error("No se ha encontrado la liga")
    }
}

export const buscarLiga = async (name = '') => {
    const liga = await leagueModel.findOne({name});

    if (!liga) {
        throw new Error("No se ha encontrado la liga")
    }
}

export const buscarEquipoLocal = async (name = '') => {
    const equipoLocal = await teamModel.findOne({name});

    if (!equipoLocal) {
        throw new Error("No se ha encontrado el equipo local")
    }
}

export const buscarEquipoVisitante = async (name = '') => {
    const equipoVisitante = await teamModel.findOne({name});

    if (!equipoVisitante) {
        throw new Error("No se ha encontrado el equipo visitante")
    }
}

export const validarQueNoSeanIguales = async (equipoLocal, equipoVisitante) => {
    if(equipoLocal._id === equipoVisitante._id) {
        throw new Error("Los equipos no pueden ser iguales")
    }
}



