import twilio from "twilio"
import envs from "../config/env.config.js"

const {TWILIO_ACCOUNT_SID, TWILIO_SMS_NUMBER, TWILIO_AUTH_TOKEN} = envs // desestructuramos las variables de entorno

export const sendSMS = async (phone, message) => {
    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        await client.messages.create({
            body: message, // mensaje que estamos recibiendo por parámetro
            from: TWILIO_SMS_NUMBER, // remitente: nuestro nro de twilio
            to: phone // destinatario: telefono que reciba por parámetro
        })
    } catch (error) {
        console.log(error)
    }
}