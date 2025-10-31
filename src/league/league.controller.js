import leagueModel from "./league.model.js";
import { subirImagenImgbb } from "../middlewares/imgbb.js";
import { validarPermisos } from "../helpers/db-validator.js";

export const createLeague = async (req, res) => {
    try {
        const data = req.body;
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


        const nuevaLiga = new leagueModel({
            name: data.name,
            pais: data.pais,
            imagen: imagenUrl
        })

        await nuevaLiga.save();

        res.status(200).json({
            success: true,
            message: "Liga creada correctamente",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar crear la liga",
            error: error.message
        })
    }
}

export const getAllLeagues = async (req, res) => {
    try {
        const ligas = await leagueModel.find();
        res.status(200).json({
            success: true,
            message: "Obtenidos los datos de las ligas",
            ligas
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al intentar obtener las ligas",
            error: error.message
        })
    }
}


export const getLeagueByName = async (req, res) => {
    try {
        const { name } = req.params;

        const liga = await leagueModel.findOne({ name });

        if (!liga) {
            return res.status(400).json({
                message: "No se ha encontrado la liga"
            })
        }

        res.status(200).json({
            success: true,
            message: "Liga encontrada correctamente",
            liga
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al intentar obtener la liga",
            error: error.message
        })
    }
}

export const updateLeague = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = req.user;

        await validarPermisos(req);

        const updateData = { ...data };

        if (req.file && req.file.buffer) {
            const nuevaUrlImagen = await subirImagenImgbb(req.file.buffer);
            updateData.imagen = nuevaUrlImagen;
        }

        const ligaActualizada = await leagueModel.findByIdAndUpdate(id,
            updateData,
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Liga actualizada correctamente",
            liga: ligaActualizada
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar actualizar la liga",
            error: error.message
        })
    }
}

export const deleteLeague = async (req, res) => {
    const id = req.params.id;

    try {
        const liga = await leagueModel.findById(id)
        await validarPermisos(req);

        const ligaEliminada = await leagueModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Liga eliminada correctamente",
            liga: ligaEliminada
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar eliminar la liga",
            error: error.message
        })
    }
}