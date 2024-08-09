import { createLogger, transports, format, addColors } from "winston"
const { printf, combine, colorize, timestamp } = format // Desestructuramos las funciones / métodos que necesitamos utilizar de la herramienta format de winston

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "magenta"
    }
}

// Agregamos los colores personalizados a winston 

addColors(customLevels.colors)

// Formateo para nuestros logs (la funcion log format la vamos a usar para darle formato a la consola y a los archivos)

const logFormat = printf(({ level, message, timestamp }) => { // timestamp: hora y fecha en la q se muestra el log
    return `${timestamp} ${level}: ${message}`
})

// Formato de la consola

const consoleFormat = combine(
    colorize(), // le indicamos que queremos utilizar los logs con color
    timestamp({ format: "YYYY-MM-DD HH:mm:mss" }), // formatea la info de la fecha para q quede más prolija
    logFormat
)

export const logger = createLogger({
    levels: customLevels.levels,
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:mss" }),
        logFormat
    ),
    // Vamos a crear un transporte: sistema de almacenamiento de nuestros loggers
    transports: [
        new transports.Console({format: consoleFormat, level: "http"}), // le permite al logger ejecutar en consola los logs que estamos solicitando. En el level, indicamos el nivel máximo al que accede. Por defecto, accede hasta el nivel 2, sino le indicamos un nivel acá.
        new transports.File({ filename: "logs/app.log", level: "http"}), // le pedimos a este transporte que guarde un archivo con todos los logs
        //En el level, indicamos el nivel máximo al que accede
        new transports.File({filename: "logs/error.log", format: logFormat, level: "error"}),
        new transports.File({filename: "logs/warn.log", format: logFormat, level: "warn"}),
        new transports.File({filename: "logs/info.log", format: logFormat, level: "info"}),
        new transports.File({filename: "logs/http.log", format: logFormat, level: "http"}),
    ]
})