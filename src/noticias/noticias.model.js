import mongoose, { model } from "mongoose";


const noticiaSchema = new mongoose.Schema({
    titulo: {type: String, required: [true, "El titulo es obligatorio"]},
    texto: {type: String, required: [true, "El texto es obligatorio"]},
    imagen: {type: String, required: [true, "La imagen es obligatoria"]},
    status: {type: Boolean, default: true}

}, {
    timestamps: true,
    versionKey: false
})

export default model("Noticia", noticiaSchema)