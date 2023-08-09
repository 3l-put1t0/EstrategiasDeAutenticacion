import mongoose from "mongoose";

const collectionName = 'users';

const schemaName = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    }, 
    lastName:{
        type: String,
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    role:{
        type: String,
        index: true,
        enum: ['USER', 'ADMINISTRATOR', 'PREMIUN', 'DEVELOP'],
        default: 'USER'
    },
    age: Number
});

const userModel = mongoose.model(collectionName, schemaName);

export default userModel;