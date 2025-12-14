import mongoose, {Document, Schema} from 'mongoose'

export interface IUser extends Document {
    handle: string
    name: string
    email: string
    password: string
    description: string
    image: string,
    links: string,
    visits: number
}

const userSchema = new Schema({
    //Atributos del usuario
    visits: {
        type: Number,
        default: 0 
    },
    handle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required : true,
        trim: true //es una función que quita espacios en blanco
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
    },
    image:{
        type: String,
        default:''
    },
    links: {
        type: String,
        default: '[]'
    }
})

//Crear el modelo
const UserModel = mongoose.model<IUser>('User', userSchema)
export default UserModel