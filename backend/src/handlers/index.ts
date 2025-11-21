import {Request, Response} from 'express'
import {validationResult} from 'express-validator'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import jwt from 'jsonwebtoken'
import { generateJWT } from '../utils/jwt'

export const createAccount = async(req: Request, res: Response)=>{

    const {email, password, handle} = req.body

    const userExists = await User.findOne({email}) //findOne es como un where en bd relacionales

    if(userExists){
        const error = new Error('El usuario ya está registrado')
        return res.status(409).json({error: error.message})
    }

    //Otra forma de agregar datos / instanciar el modelo User:
    const user = new User(req.body)
    user.password = await hashPassword(password)

    console.log(slug(handle, ''))
    
    //Hash contraseñas:
    //const hash = await hashPassword(password)
    //console.log(hash)
    //

    await user.save()

    res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
    //Manejar errores
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }

    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        const error = new Error('El usuario no existe')
        return res.status(404).json({error: error.message})
    }
    
    //Comprobar el password
    //console.log(user.password)
    //checkPassword(password, user.password)

    const isPasswordCorrect = await checkPassword(password, user.password)

    if(!isPasswordCorrect){
        const error = new Error('Password incorrecto')
        return res.status(401).json({error: error.message})
        //401: porque no está autorizado a acceder al recurso
    }
    
    //res.send('Autenticado...')

    //Hasta aquí tenemos un usuario que ingresó correctamente, entonces:
    const token = generateJWT({id: user._id})
    res.send(token)

}

export const getUser = async(req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async(req: Request, res: Response) => {
    try {
        console.log(req.body)
        const {description} = req.body
        const handle = slug(req.body.handle,'')
        const handleExists = await User.findOne({handle})
        if(handleExists && handleExists.email !== req.user.email){
            const error = new Error('Nombre de usuario nombre no disponible')
            return res.status(409).json({error: error.message})
        }
        req.user.description = description
        req.user.handle = handle
        await req.user.save()

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(404).json({error: error.message})
    }
}