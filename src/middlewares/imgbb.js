import axios from "axios"; //biblioteca para realizar peticiones HTTP
import { configDotenv } from "dotenv"; //para cargar variables de entorno desde el archivo .env

configDotenv();

export const subirImagenImgbb = async (buffer) => {
    const apiKey = process.env.IMGBB_API_KEY; //accede a la variable de entorno IMGBB_API_KEY desde el archivo .env

    const base64Image = buffer.toString("base64"); //convertir el buffer en base64

    const response = await axios.post( //enviar la petición POST a la API de Imgbb
        `https://api.imgbb.com/1/upload?key=${apiKey}`, //URL de la API de Imgbb
         new URLSearchParams({ //crear un objeto de búsqueda de URL con las propiedades de la imagen
            image: base64Image,
         }),
         {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }, //establecer el tipo de contenido de la petición
         }
    )

    return response.data.data.url; //devolver la URL de la imagen subida a Imgbb
}