import express from "express"
import { createHash, isValidPassword } from "./src/config/utils.js";
import userModel from "./src/DAO/models/users.model.js"
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./src/config/passport.config.js";

const URL = `mongodb+srv://Secas:mongoDB$123@cluster0.wbsfiqg.mongodb.net/ecommerce?retryWrites=true&w=majority`;
const keySession= 'k3y#$Secret';

try {
    mongoose.connect(URL);
} catch (er) {
    console.log('ERROR DE CONNECION');
}

const app = express();
initializePassport();

app.use(express.json());
app.use(session({
    //  Va a generar una colección donde se guarda la sesión respectiva, esto
    // con el fin de sostener la sesión si se llega a caer los servicios 
    store: MongoStore.create({
        mongoUrl: URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 150
    }),
    secret: keySession,  //  Firma para encriptar la sesión
    resave: true,
    saveUninitialized: true    
}));
app.use(passport.initialize());
app.use(passport.session());

// en este caso primero va a validar con la estrategia register si 
// el usuario esta registrado, con base a ello autentica al usuario
app.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), async (req, res) => {
    console.log(req);
    res.status(200).send({ status: 'success', message: 'usuario registrado' });
});

app.get('/failRegister', (req, res) => {
    console.log('failRegister: ERROR AL REGISTRARSE');
    res.status(401).send({ status: 'error' });
});


app.post('/login', passport.authenticate('login', { failureRedirec: '/failLogin' }), async (req, res) => {
    console.log('req: ', req);
    console.log('req: ', req.user);
    if (!req.user) return res.status(401).send({ status: 'error', message: 'error la generar usuario (logueo)' })
    req.session.user = {
        firstName: req.user.firstName,
        email: req.user.email,
        role: req.user.role
    }
    res.status(200).send({ status: 'success', message: 'usuario logueado' });
});

app.get('/failLogin', (req, res) => {
    console.log('failLogin: ERROR AL LOGUEARSE');
    res.status(401).send({ status: 'error' });
});
// en esta parte sólo se hace la encriptación de info, en la parte de arriba se 
// implementa la estrategía de registro donde realiza la misma función de encriptación

// app.post('/register', async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, role, age } = req.body;
//         if (!firstName || !email || !password) return res.status(400).send({ status: "error", message: "falta datos" });
//         const existEmail = await userModel.findOne({email});
//         if (!existEmail) return res.status(404).send({ status: "error", message: "el email ya existe" });
//         const user = {
//             firstName,
//             lastName,
//             email,
//             password: createHash(password),
//             age
//         };
//         const result = await userModel.create(user);
//         res.status(201).send({ status: "success", message: result });
//     } catch (er) {
//         console.log(er.message);
//     }

// });


// en esta parte sólo se valida la infor, en la parte de arriba se 
// implementa la estrategía de login donde realiza la misma función de validación

// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) return res.status(403).send({ status: 'error', message: 'datos incompletos' });
//         const user = await userModel.findOne({ email });
//         if (!isValidPassword(user, password)) return res.status(403).send({ status: 'error', message: 'error en los datos' });
//         delete user.password;
//         req.session.user = user;
//         res.status(200).send({ status: 'success', message: 'Se logueo correctamente' });

//     } catch (er) {
//         console.log(er.message);
//     }
// });

app.listen(8080, console.log("OK PORT 8080"));