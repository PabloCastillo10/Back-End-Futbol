import jwt from "jsonwebtoken";
import authModel from "../auth/auth.model.js";


export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token")

    if (!token) {
        return res.status(401).json({error: "No se ha proporcionado el token"})
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); 

        const user = await authModel.findById(uid);

        if (!user) {
            return res.status(400).json({
                msg: "User token not found"
            })
        }

        if (user.status === "false") {
            return res.status(400).json({
                msg: "Invalid token - user with status false"
            })
        }

        req.user = user;

        next(); // pass control to the next handler
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: "Invalid token o inexistente"
        })
    }
}