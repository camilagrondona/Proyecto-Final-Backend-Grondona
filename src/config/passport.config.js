import passport from "passport"
import local from "passport-local"
import google from "passport-google-oauth20"
import jwt from "passport-jwt"
import { createHash, isValidPassword } from "../utils/hashPassword.js"
import userDao from "../dao/mongoDao/user.dao.js"

// Métodos de autenticación (estrategias)

// Inicialización estrategia local 

const LocalStrategy = local.Strategy

// Inicialización estrategia de Google

const GoogleStrategy = google.Strategy

// Inicialización estrategia de Json web token

const JWTStrategy = jwt.Strategy

const ExtractJWT = jwt.ExtractJwt // Extractor de información (token) (requests: se pueden obtener mediante req params, cookies, headers, body)

// Función para extraer información de la cookie

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) { // chequeamos si existe una request y una request.cookie
        token = req.cookies.token // extraemos el token de la cookie y lo asignamos a la variable token
    }
    return token
}

// Estrategia local 

// Función que inicializa las estrategias que configuremos

const initializePassport = () => {
    passport.use(
        "register", // 1er parámetro: alias de conexión para que sepa qué estrategia estamos utilizando. Nombre de la estrategia que estamos creando. 
        new LocalStrategy( // 2do parámetro: configuración de la nueva estrategia local 
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, email, age, role } = req.body // Recibimos por el cuerpo del body los datos de usuario y desestructuramos la información que realmente necesitamos que llegue a la base de datos. ACÁ NO INCLUIMOS EL PASSWORD PORQUE YA LO ESTAMOS RECIBIENDO EN PASSPORT. 
                    const user = await userDao.getByEmail(username) // username equivale al email
                    if (user) return done(null, false, { message: "El usuario ya existe" }) // si el usuario ya existe, devuelve un error y no lo duplica. El null indica que no hay error, ya que el primer parámetro que pide el done es el error. El false indica que no se le va a pasar ningún usuario porque no se va a registrar. 

                    // else: creamos el usuario. Pasamos el usuario a registrar como newUser con sus propiedades

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        password: createHash(password), // le paso el password que estamos recibiendo y lo guarda haseado
                        age,
                        role
                    }

                    const createUser = await userDao.create(newUser) // creamos el nuevo usuario con userDao
                    return done(null, createUser) // 1er parámetro le decimos que no hay ningún error y en el segundo lo creamos. Con el done se lo pasamos a passport para que lo maneje de forma global en nuestra app. 
                } catch (error) {
                    return done(error) // Si ha habido un error en la autenticación se lo pasamos en el done
                }
            }
        )
    )
    
    // Aclaración conceptos utilizados: 

    /* 
    - Passport está configurado para que pueda captar/ recibir solo dos propiedades del usuario: username y password. Por eso le decimos que la propiedad username en nuestro caso debe ser el email del usuario: usernameField: "email". 
    
    - passReqToCallBack: true - Le permitimos a passport que acceda a la request del usuario en la función de autenticación. 
    
    - done: función para avisarle a passport si está todo ok o si enviamos un error. Es muy similar al next.
    */

// -----------------------------------------------------------------------//

passport.use(
    "login", 
    new LocalStrategy({usernameField: "email"}, async (username, password, done) => {
        try {
            const user = await userDao.getByEmail(username)
            if(!user || !isValidPassword(user, password)) return done(null, false,{message: "Usuario o contraseña inválidos" }) // Si no hay un usuario logueado o si no coincide la contraseña no se avanza con el logueo (false), es decir, no serializa ningún usuario. 
            return done(null, user) // En caso de que los datos del usuario sean correctos, retornamos el user que va a deserializar 
        } catch (error) {
            done(error)
        }
    })
)

// Estrategia de Google 

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: "", 
            clientSecret: "",
            callbackURL: "http://localhost:3000/api/session/google" // Endpoint al que se va a comunicar la estrategia 
        },
        async (accessToken, refreshToken, profile, cb) => { // cb es un callback equivalente al done
            try {
                const {name, emails} = profile // información del usuario que se loguea que nos brinda google
                const user = {
                    first_name: name.givenName,
                    last_name: name.familyName,
                    email: emails[0].value
                }
                const userExists = await userDao.getByEmail(emails[0].value) // corroboramos si existe el usuario registrado
                if(userExists) return cb(null, userExists) // Le pasamos a passport el usuario que va a serializar con el userExists para acceder a su sesión, y el null porque no hay errores
                const newUser = await userDao.create(user) // Le pasamos el user que armamos en el objeto con la información del profile de google 
                cb(null, newUser) // Pasamos el newUser para que passport serialice y deserialice la información 
            } catch (error) {
                return cb(error)
            }
        }
    )
)

// Estrategia de JWT 

passport.use("jwt", new JWTStrategy(
    {
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), // Extraer la información que necesita de la request / token y pasamos por parametro la funcion cookieExtractor
    secretOrKey: "codigoSecreto" // tiene que coincidir con el codigo secreto que hemos configurado en jwt.js
    },
    async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload) // en el payload tenemos el token
        } catch (error) {
            return done(error)
        }
    }
)) // 1er parámetro: nombre de la estrategia / 2do parámetro: configuración de la instancia de nuestra estrategia

// -----------------------------------------------------------------------//

    // Serialización y deserialización de usuarios

    /* 
    - La serialización y deserialización de usuarios es un proceso que nos permite almacenar y recuperar información del usuario en la sesión.
    
    - La serialización es el proceso de convertir un objeto de usuario en un identificador único.
    
    - La deserialización es el proceso de recuperar un objeto de usuario a partir de un identificador único.
    
    - Los datos del user se almacenan en la sesión y se recuperan en cada petición.
    
    */

    passport.serializeUser((user, done) => {
        done(null, user._id) // Va con _ porque es el id de mongo
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userDao.getById(id) // Obtenemos el usuario pasándole el id que recibimos por parámetro
        done(null, user)
    })
}

export default initializePassport