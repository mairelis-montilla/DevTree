//crear el jwt y validarlo

import jwt, {JwtPayload} from 'jsonwebtoken'

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: '180d'
        //duración del jwt, 1d = 1día
    })
    return token
    //payload: información que se quiere colocar en el jwt
}