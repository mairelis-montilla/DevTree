//const express = require('express') CommonJS
import express from 'express' //Modules
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import {connectDB} from './config/db'
import { corsConfig } from './config/cors'

//instancia del servidor
const app = express()

connectDB()

//Leer datos del formulario
app.use(express.json()) //queremos habilitar la lectura de datos con el express.json

//Cors: Middleware global
app.use(cors(corsConfig))

app.use('/', router) //cada que hay una petición a la URL principal se ejecuta a router

export default app