import swaggerJSDoc from "swagger-jsdoc"
import __dirname from "../../dirname.js"

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de API E-commerce",
            version: "1.0.1",
            description: "Esta es una API para procesos de compra de ropa con un sistema de usuarios."
        }
    },
    apis:[`${__dirname}/src/docs/**/*.yaml`] // los asteriscos indican que va a leer todos los archivos dentro de la carpeta docs y los archivos que tengan la extensión yaml
}

export const specs = swaggerJSDoc(swaggerOptions)