import mongoose from "mongoose";


const CalificacionSchema = new mongoose.Schema({
     usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    destinario: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    estrellas: {type: Number,},
    comentario: {type: String, },
    createdAt: {type: Date, default: Date.now},
})

export default mongoose.model("Calificacion", CalificacionSchema)