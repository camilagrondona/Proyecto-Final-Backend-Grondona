import express from "express"   
import router from "./routes/index.js"
import {connectMongoDB} from "./config/mongoDb.config.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import cookieParser from "cookie-parser"

// Conexión con MongoDB

connectMongoDB() 

// Creamos la app de express ejecutando la función. Se creó el servidor

const app = express() 

// Configuramos el servidor con determinadas funcionalidades (middlewares)

app.use(express.json()) // Para manejar json
app.use(express.urlencoded({ extended: true })) // Para leer querys y params
app.use(cookieParser("secret")) // Cookie parser - Pide un código secreto para tener cookies cifradas, por eso le pasamos secret

// Configuración de Mongo (para trabajar con las session)

app.use(session({
    store: MongoStore.create({
        mongoUrl: "",
        ttl: 15 // tiempo de sesión 15 min
    }),
    secret: "CodigoSecreto",
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

// Inicializamos la app de express configurando: 

// 1) El puerto donde se inicializa el servidor

const port = 3000

// 2) Función ready, para que cuando el servidor esté inicializado nos muestre en consola el siguiente mensaje: 

const ready = console.log("Server ready on port " + port)

// Para inicializar el servidor, necesito escuchar el puerto 8080 y luego de que se levantó ejecutar la callback ready 

app.listen(port, ready) // Está inicializado pero aún no está funcionando; para ello, hay que correr en la consola el comando "npm run dev"

