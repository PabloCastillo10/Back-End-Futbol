import calificacionModel from "./calificacion.model.js";


export const crearCalificacion = async (req, res) => {
    try {
        const {estrellas, comentario} = req.body;
        const usuario = req.user;
        const destinario = req.params.id;
        const yaExiste = await calificacionModel.findOne({usuario, destinario});

        if(yaExiste) {
            return res.status(400).json({
                msg: "Ya calificaste ya no puedes volver a calificar"
            })
        }

        const nuevaCalificacion = new calificacionModel({
            usuario,
            destinario,
            estrellas,
            comentario
        })
        await nuevaCalificacion.save();

        res.status(200).json({
            msg: "Calificacion creada correctamente",
            califcacion : nuevaCalificacion
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: "Error al crear calificacion",
            error: error.msg
        })
    }
}

export const getCalificacion = async (req, res) => {
    try {
        const usuario = req.user;

        const calificaciones = await calificacionModel.find({destinario: usuario._id})
        .populate("usuario", "name surname")
        .populate("destinario", "email role")
        .sort({createdAt: -1})
        

        res.status(200).json({
            msg: "Listado de calificaciones",
            calificaciones
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}

export const getPromedioCalificacion = async (req, res) => {
    try {
        const usuario = req.user;
        const calificaciones = await calificacionModel.find({destinario: usuario._id})
        const totalEstrellas = calificaciones.reduce((total, calificacion) => total + calificacion.estrellas, 0);
        const promedio = calificaciones.length > 0 ? totalEstrellas / calificaciones.length : 0;

        res.status(200).json({
            message: 'Promedio de calificaciones',
            promedioEstrellas: promedio.toFixed(1)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}