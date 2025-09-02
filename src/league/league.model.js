import { Schema, model } from "mongoose";

const LeagueSchema = new Schema({
    name: {
        type: String,
        required: [true, "Porfavor ingresa el nombre de la liga"],
        unique: [true, "Este nombre de liga ya existe porfavor intenta con otro"],
    },
    pais: {
        type: String,
        required: [true, "Porfavor ingresa el pais de la liga"],
    },
    
    imagen: {
        type: String,
        required: [true, "Porfavor ingresa la imagen de la liga"]
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("League", LeagueSchema)