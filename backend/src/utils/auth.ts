import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10) //10 rondas
    return await bcrypt.hash(password, salt)

    
}
//Función para comprobar el password
export const checkPassword = async (enteredPassword: string, hash: string) =>{
    //console.log(enteredPassword)
    //console.log(hash)     
    
    return await bcrypt.compare(enteredPassword, hash)
    
}
