import teamModel from "./teams.model.js";
import leagueModel from "../league/league.model.js";
import { subirImagenImgbb } from "../middlewares/imgbb.js";
import { validarPermisos } from "../helpers/db-validator.js";

export const createTeam = async (req, res) => {
    try {
        const data = req.body;
        const league = await leagueModel.findOne({ name: data.league })
        const user = req.user;
        await validarPermisos(req);

        let imagenUrl;

        if (req.file && req.file.buffer) {
            imagenUrl = await subirImagenImgbb(req.file.buffer); // archivo
        } else if (data.imagen && data.imagen.startsWith("http")) {
            imagenUrl = data.imagen; // URL directa
        } else {
            return res.status(400).json({ message: "Debe proporcionar una imagen o una URL" });
        }

        const nuevoEquipo = new teamModel({
            ...data,
            imagen: imagenUrl,
            league: league,
            status: true
        })

        await nuevoEquipo.save();

        const teamSave = await teamModel.findById(nuevoEquipo._id).populate("league", "name")

        res.status(200).json({
            success: true,
            message: "Equipo creado exitosamente",
            team: teamSave,
            role: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al crear el equipo"
        })
    }
}


export const getAllTeams = async (req, res) => {
    try {
        const teams = await teamModel.find({ status: true }).populate("league", "name")
        res.status(200).json({
            message: "Lista de Equipos obtenido exitosamente",
            teams
        })
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al obtener la lista de Equipos"
        })
    }
}


export const getTeamsLeague = async (req, res) => { 
    try{
        const {name} = req.params;

        const league = await leagueModel.findOne({name}) //BUSCA EL NOMBRE DE LA LIGA

        if (!league) {
            return res.status(404).json({
                success: false,
                message: "Liga no encontrada"
            });
        }

        //CHATGPT
        const teams = await teamModel.find({league: league._id}, "name imagen historia estadio").sort({name: 1}) // 1 = ascendente (A a Z), -1 = descendente (Z a A)

        res.status(200).json({
            success: true,
            message: `Lista de Equipos de La Liga ${league.name}`,
            teams
        })
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al obtener la lista de equipos de esta liga",
            error: error.message
        })
    }
}

export const getTeamsByName = async (req, res) => {
    try {

        const { name } = req.params;

        const teams = await teamModel.findOne({ name }, "pais").populate("league", "name");

        if (!teams) {
            return res.status(400).json({
                message: "No se ha encontrado el equipo"
            })
        }

        res.status(200).json({
            success: true,
            message: "Equipo encontrado correctamente",
            teams
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar el equipo",
            error: error.message
        })
    }
} 

export const updateTeams = async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const user = req.user;

        await validarPermisos(req);

        const updateData = {...data};

        if (req.file && req.file.buffer) {
            const nuevaUrlImagen = await subirImagenImgbb(req.file.buffer);
            updateData.imagen = nuevaUrlImagen;
        }

        if(data.league) {
            const league = await leagueModel.findOne({name: data.league});

            if(!league) {
                return res.status(400).json({msg: "Liga no encontrada"})
            }

            updateData.league = league._id;
        }

        const teamUpdated = await teamModel.findByIdAndUpdate(
            id,
            updateData,
            {new: true}
        ).populate("league", "name");

        res.status(200).json({
            success: true,
            message: "Equipo actualizado exitosamente",
            teams: teamUpdated
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el equipo"
        })
    }
}

export const deletedTeams = async (req, res) => {
    const id = req.params.id;

    try {
        const teams = await teamModel.findById(id);
        await validarPermisos(req)

        const teamsDelete = await teamModel.findByIdAndUpdate(id, {status: false}, {new: true})

        res.status(200).json({
            success: true,
            message: "Equipo Eliminado",
            teamsDelete
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el equipo",
            error: error.message
        })
    }
}