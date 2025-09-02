import { Schema, model } from "mongoose";


const UserSchema = new Schema({
    name : {
        type: String,

    },
    surname : {
        type : String,
    },
    email: {
        type: String,
        required: [true, "Porfavor ingresa tu email"],
        unique: [true, "Este email ya existe porfavor intenta con otro"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Porfavor ingresa tu contraseña"],
    },
    role : {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
    status : {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("User", UserSchema)