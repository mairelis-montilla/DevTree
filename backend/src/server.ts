import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import analyticsRouter from './router/analytics'
import {connectDB} from './config/db'
import { corsConfig } from './config/cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'

const app = express()

connectDB()

app.use(express.json())
app.use(cors(corsConfig))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/', router)
app.use('/api/analytics', analyticsRouter)


export default app