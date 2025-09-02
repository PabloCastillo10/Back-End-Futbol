import multer from "multer"; //middleware para subir archivos
import {dirname, extname, join} from "path"; //para obtener el directorio de la aplicación
import { fileURLToPath } from "url"; //para convertir una URL de archivo a una ruta de archivo


const CURRENT_DIR = dirname(fileURLToPath(import.meta.url)); //obtener la ruta de la aplicación

const Mimetypes = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/svg+xml"]; //tipos de archivos permitidos
const max_size = 1024 * 1024 * 1024; //tamaño máximo de archivo en bytes

const storage = multer.memoryStorage(); // constante que almacena los archivos en memoria RAM como buffer

const fileFilter = (req, file, cb) => { //cb === callback de la funcion
    if (Mimetypes.includes(file.mimetype)) { //si el tipo de archivo es permitido
        cb(null, true); //devuelve true y indica que el archivo debe ser aceptado
    } else {
        cb(new Error("Tipo de archivo no permitido")); //devuelve un error y indica que el archivo no debe ser aceptado
    }
} // validar el tipo de archivo

const upload = multer({
    storage, // le dice a multer que almacene los archivos en memoria RAM como buffer
    fileFilter, //filtro de archivos
    limits: {
        fileSize: max_size //tamaño máximo de archivo en bytes
    },
})

export const uploadImage = upload.single("imagen")