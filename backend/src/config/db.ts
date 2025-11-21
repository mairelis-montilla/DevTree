import mongoose from "mongoose"

//console.log(process.env)

export const connectDB = async () => {

    try{
        const {connection} = await mongoose.connect(process.env.MONGO_URI)

        const url = `${connection.host}:${connection.port}`
        //console.log(connection)
        console.log(`MongoDB conectado en ${url}`)
    }catch(error){
        console.log(error.message)
        process.exit(1) //terminar ejecución del programa
    }
    //mongodb+srv://root:<db_password>@cluster0.qbswvqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
}