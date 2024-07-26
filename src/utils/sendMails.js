import nodemailer from "nodemailer"
import envs from "../config/env.config.js"
import __dirname from "../../dirname.js"

export const sendMail = async (email, subject, message, template) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // servicio a utilizar
        port: 587, // puerto
        auth: { // credenciales
            user: "camilagrondonadev@gmail.com",
            pass: envs.GMAIL_PASS
        }
    })
    await transporter.sendMail({
        from: "camilagrondonadev@gmail.com", // remitente email
        to: email, // destinatario (el email que recibimos por parámetro)
        subject, // asunto (recibido por params)
        text: message, // texto (mensaje recibido por params)
        html: template,
        attachments:[
            {
                filename: "perrito.jpg",
                path: __dirname + "/public/images/perrito.jpg",
                cid: "perrito"
            }
        ]
    })
}