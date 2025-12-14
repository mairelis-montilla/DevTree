import {Request, Response} from 'express'
import {validationResult} from 'express-validator'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
import { generateJWT } from '../utils/jwt'
import cloudinary from '../config/cloudinary'

export const createAccount = async(req: Request, res: Response)=>{
    const {email, password} = req.body

    const userExists = await User.findOne({email})

    if(userExists){
        const error = new Error('El usuario ya está registrado')
        return res.status(409).json({error: error.message})
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)

    await user.save()

    res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
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

    const isPasswordCorrect = await checkPassword(password, user.password)

    if(!isPasswordCorrect){
        const error = new Error('Password incorrecto')
        return res.status(401).json({error: error.message})
    }

    const token = generateJWT({id: user._id})

    res.send({ token })
}

export const getUser = async(req: Request, res: Response) => {
    // Ensure links is always valid JSON
    const user = req.user.toObject()
    if (!user.links || user.links.trim() === '') {
        user.links = '[]'
    }
    res.json(user)
}

export const updateProfile = async(req: Request, res: Response) => {
    try {
        console.log(req.body)
        const {description, links} = req.body
        const handle = slug(req.body.handle,'')
        const handleExists = await User.findOne({handle})
        if(handleExists && handleExists.email !== req.user.email){
            const error = new Error('Nombre de usuario nombre no disponible')
            return res.status(409).json({error: error.message})
        }
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(404).json({error: error.message})
    }
}

export const uploadImage = async(req: Request, res: Response)=> {
    const form = formidable({multiples:false})
    form.parse(req,(error,fields,files)=>{
        cloudinary.uploader.upload(files.file[0].filepath,{public_id: uuid()},async function(error,result){
            if(error){
                const error = new Error("Hubo un error al subir la imagen")
                return res.status(500).json({error:error.message})
            }
            if(result){
                req.user.image = result.secure_url
                await req.user.save()
                res.json({image:result.secure_url})
            }
        })
    })
}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params

        const user = await User.findOne({ handle })
            .select('-_id -password -email -__v')

        if (!user) {
            const error = new Error('El usuario no existe')
            return res.status(404).json({ msg: error.message })
        }

        // Ensure links is always valid JSON
        const userData = user.toObject()
        if (!userData.links || userData.links.trim() === '') {
            userData.links = '[]'
        }

        res.json(userData)
    } catch (error) {
        const e = new Error('Hubo un error')
        return res.status(500).json({ msg: e.message })
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
            .select('handle name description image')
            .limit(20)
        res.json(users)
    } catch (error) {
        const e = new Error('Hubo un error')
        return res.status(500).json({ msg: e.message })
    }
}