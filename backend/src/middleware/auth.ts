import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, {IUser} from '../models/User'

declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if(!bearer){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }

    const [, token] = bearer.split(' ')

    if(!token){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }

    try {
        // 1. Verificar el token
        const result = jwt.verify(token, process.env.JWT_SECRET)
        
        // 2. Buscar al usuario (ESTO ES LO QUE FALTABA)
        if(typeof result === 'object' && result.id){
            const user = await User.findById(result.id).select('-password')
            
            if(!user){
                const error = new Error('El usuario no existe')
                return res.status(404).json({error: error.message})
            }
            
            req.user = user
            next() // <--- IMPORTANTE: Dejar pasar a la siguiente función
        }
        
    } catch(error) {
        // --- TRAMPA PARA CAZAR EL ERROR ---
        console.log("--------------------------------")
        console.log("EL ERROR ES:", error)
        console.log("MI SECRETO ES:", process.env.JWT_SECRET)
        console.log("--------------------------------")
        // ----------------------------------
        
        return res.status(500).json({error: 'Hubo un error en el token'})
    }
}
