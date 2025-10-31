import noticiasModel from "./noticias.model.js";
import { subirImagenImgbb } from "../middlewares/imgbb.js";
import { validarPermisos } from "../helpers/db-validator.js";

// - Permite subir una imagen desde el frontend (buffer de archivo) o una URL ya existente
export const createNotica = async (req, res) => {
    try {
        const data = req.body;
        await validarPermisos(req);
        let imagenUrl;

        //El cliente envia una imagen  con multer
        if (req.file && req.file.buffer)  {
            //Subimos la imagen a imgbb y obtenemos la url de la imagen
            imagenUrl = await subirImagenImgbb(req.file.buffer);
        //El cliente envia una imagen con una URL valida
        } else if (data.imagen && data.imagen.startsWith("http")) { 
            imagenUrl = data.imagen; // URL directa
        // Si no se envia ninguna imagen, se devuelve un error
        } else {
            return res.status(400).json({ message: "Debe proporcionar una imagen o una URL" });
        }

        const nuevaNoticia = new noticiasModel({
            titulo: data.titulo,
            texto: data.texto,
            imagen: imagenUrl
        });

        await nuevaNoticia.save();

        res.status(200).json({
            success: true,
            message: "Noticia creada correctamente",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar crear la noticia",
            error: error.message
        })
    }

}

export const getAllNoticias = async (req, res) => {
    try {
        const noticias = await noticiasModel.find();
        res.status(200).json({
            success: true,
            message: "Obtenidos los datos de las noticias",
            noticias
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al intentar obtener las noticias",
            error: error.message
        })
    }
}

export const getUltimasNoticias = async (req, res) => {
    try {
        const noticias = await noticiasModel.find({status: true}).sort({createdAt: -1}).limit(3);
        res.status(200).json({
            success: true,
            message: "Obtenidos las ultimas noticias",
            noticias: noticias
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al intentar obtener las ultimas noticias",
            error: error.message
        })
    }
}

export const updateNoticias = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await validarPermisos(req);

        const updateData = { ...data };

        if (req.file && req.file.buffer) { // el req.file && req.file.buffer es para que no se ejecute el if si no hay imagen
            const nuevaUrlImagen = await subirImagenImgbb(req.file.buffer); // una constante que es la url de la imagen y await para que se espere a que termine la subida
            updateData.imagen = nuevaUrlImagen; //updateData es un objeto que contiene los datos a actualizar
        }

        const noticiaActualizada = await noticiasModel.findByIdAndUpdate(id,
            updateData, 
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Noticia actualizada correctamente",
            noticia: noticiaActualizada
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error al actualizar la noticia",
            error: error.message
        })
    }
}

export const deleteNoticia = async (req, res) => {
    const id = req.params.id;

    try {
        await validarPermisos(req);

        const noticiaEliminada = await noticiasModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Noticia eliminada correctamente",
            noticia: noticiaEliminada
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar eliminar la noticia",
            error: error.message
        })
    }
}