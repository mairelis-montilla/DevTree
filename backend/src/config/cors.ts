import {CorsOptions} from 'cors';

export const corsConfig : CorsOptions  = {
    //origin: de dónde se está enviando la petición
    origin: function(origin, callback){

        // En desarrollo, permitir todas las peticiones de localhost
        if(process.env.NODE_ENV === 'development'){
            // Permitir peticiones sin origin (Postman, Swagger, curl, etc.)
            if(!origin){
                callback(null, true)
                return
            }
            // Permitir localhost en cualquier puerto
            if(origin.includes('localhost') || origin.includes('127.0.0.1')){
                callback(null, true)
                return
            }
        }

        // En producción o para otros orígenes
        const whiteList = [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }

        if(whiteList.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}