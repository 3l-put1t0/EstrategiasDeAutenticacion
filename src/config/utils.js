/*
Se va a encriptar la información sensible que ingrese el usuario, por ejemplo
la contraseña, y de paso se constraste si es igual el password ingresado con el
password encryptado
*/
import bcrypt from "bcrypt";

const saltRounds = 10;

// Se crea función para crear encryptación de la variable a ingresar
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

// Se valida si lo ingresado por el usuario sea igual a lo encryptado
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);