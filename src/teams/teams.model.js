import mongoose,{ Schema, model } from "mongoose";

const TeamSchema = new Schema({
    name: {
        type: String,
        required: [true, "Porfavor ingresa el nombre del equipo"],
        unique: [true, "Este nombre de equipo ya existe porfavor intenta con otro"],
    },
    pais: {
        type: String,
        required: [true, "Porfavor ingresa el pais del equipo"],
    },
    imagen: {
        type: String,
        required: [true, "Porfavor ingresa la imagen del equipo"]
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League", 
        required: [true, "Porfavor ingresa la liga del equipo"],
    },
    estadio: {
        type: String,
        required: [true, "Porfavor ingresa el estadio del equipo"],
        unique: [true, "Este estadio existe porfavor intenta de nuevo"]
    },
    historia: {
        type: String
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Team", TeamSchema)