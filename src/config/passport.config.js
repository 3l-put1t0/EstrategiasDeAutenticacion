import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "./utils.js";
import userModel from "../DAO/models/users.model.js";

const localStrategy = local.Strategy;   //Estrategía que se iría a implementar

// función para crear estrategias
const initializePassport = () => {
    // estrategía de registro
    passport.use("register", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        }, 
        async (req, username, password, done) => {
            const { firstName, lastName, email, role, age } = req.body;
            try{
                console.log('passport', username);
                console.log('passport', password);
                const user = await userModel.findOne({email: username});    // Se busca si el usuario existe
                if (user) {                                                 // Si existe retorna un false
                    console.log('El usuario ya existe');
                    return done(null, false);
                }
                // Si no existe el email se crea un objeto 
                // con la información del usuario y se encrypta el password
                const reUser = {                                            
                    firstName,
                    lastName,
                    email, 
                    password: createHash(password),
                    role,
                    age
                }
                // Se crea el objeto con la info y se envía a la base de datos
                const result = await userModel.create(reUser);
                console.log('RESULTADO: ', result);
                // se retorna el callback con el resultado
                return done(null, result);
            }catch(er){
                console.log('ERROR: ', er.message);
            }
        }
    ));
    // estrategía de logueo
    passport.use("login", new localStrategy({usernameField: 'email'},
        async(username, password, done) =>{
            try{
                const user = await userModel.findOne({email: username});
                if (!user) {
                    console.log('el usuario no existe, por favor registrese');
                    return done(null, false);
                }
                if (!isValidPassword(user, password)){
                    console.log('ingreso mal el password');
                    return done(null, false);
                }
                console.log('genero sesión');
                return done(null, user);
            }catch(er){
                console.log('ERROR login: ', er.message);
            }
        }
    ));

    passport.serializeUser(async (user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializePassport;