import server from './server'

//Crear servidor

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log('Servidor funcionando en el puerto ', port)
})