import authModel from "./auth.model.js";
import { hash } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js";
import { request, response } from "express";


export const createAdmin = async () => {
    try {
        const verifyUser = await authModel.findOne({email: "admin@gmail.com".toLowerCase()});

        if(!verifyUser) {
            const encryptedPassword = await hash("ADMINB")
            const adminUser = new authModel({
                email : "admin@gmail.com".toLowerCase(),
                password: encryptedPassword,
                role: "ADMIN",
                status: true
            })

            await adminUser.save();
            console.log("Admin creado")
        } else {
            console.log("Admin existe, no se volvio a crear")
        }
    } catch (error) {
        console.error("Error al crear ADMIn", error)
    }
}
export const Login = async (req, res) => {

    const {email, password} = req.body;

    try {

        const lowerEmail = email ? email.toLowerCase() : null;

        const user = await authModel.findOne({
            $or : [
                {email: lowerEmail}
            ]
        })

        const token = await generarJWT(user.id)

        res.status(200).json({
            success: true,
            msg: `Bienvenido a LigaXPress ${user.email}`,
            userDetails : {
                token: token,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "Error al intentar iniciar sesion."
        })
    }
}


export const Register = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);

        const nuevoUsuario = new authModel({
            name: data.name.toLowerCase(),
            surname: data.surname.toLowerCase(),
            email: data.email.toLowerCase(),
            password: encryptedPassword,
            
        })

        await nuevoUsuario.save();
        
        res.status(200).json({
            msg: "Usuario registrado correctamente",
            userDetails : {
                name: nuevoUsuario.name,
                role: nuevoUsuario.role
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error al intetar registrarte.",
            error: error.msg
        })
    }
}