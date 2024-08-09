import express from "express"   
import router from "./routes/index.js"
import {connectMongoDB} from "./config/mongoDb.config.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import cookieParser from "cookie-parser"
import envs from "./config/env.config.js"
import { errorHandle } from "./errors/errorHandle.js"
import { logger } from "./utils/logger.js"

// Conexión con MongoDB

connectMongoDB() 

// Creamos la app de express ejecutando la función. Se creó el servidor

const app = express() 

// Configuramos el servidor con determinadas funcionalidades (middlewares)

app.use(express.json()) // Para manejar json
app.use(express.urlencoded({ extended: true })) // Para leer querys y params
app.use(cookieParser(envs.SECRET_CODE)) // Cookie parser - Pide un código secreto para tener cookies cifradas 

// Configuración de Mongo (para trabajar con las session)

app.use(session({
    store: MongoStore.create({
        mongoUrl: envs.MONGO_URL,
        ttl: 15 // tiempo de sesión 15 min
    }),
    secret: envs.SECRET_CODE,
    resave: true,
    saveUninitialized: true
}))

// Middlewares de passport

app.use(passport.initialize())
app.use(passport.session())

// Función que inicializa las estrategias 

initializePassport() 

// Agregamos el prefijo api a nuestras rutas

app.use("/api", router) 

app.use(errorHandle) // Cuando express detecte el error, va a ejecutar automáticamente esta función (que actúa como middleware)

// Inicializamos la app de express configurando: 

// 1) El puerto donde se inicializa el servidor

// 2) Console log para que cuando el servidor esté inicializado nos muestre en consola el siguiente mensaje: 

app.listen(envs.PORT, () => {
    logger.log("info", `Server ready on port ${envs.PORT}`)
}) // Está inicializado pero aún no está funcionando; para ello, hay que correr en la consola el comando "npm run dev"




