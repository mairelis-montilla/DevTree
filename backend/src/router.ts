import {Router} from 'express'
import {body} from 'express-validator' //body permite validar el req.body
import User from './models/User'
import { createAccount, getUser, login, updateProfile } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

//Permite configurar un objeto con todas las rutas que después podemos agregar a la app principal server.ts

const router = Router()

/* Autenticación y Registro*/
router.post('/auth/register', 
    
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    createAccount)

router.post('/auth/login', 
    
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('El password es muy corto, mínimo 8 caracteres'),

    login)

router.get('/user', authenticate, getUser)
router.patch('/user',
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('description').notEmpty().withMessage('la descripción no puede ir vacía'),
    handleInputErrors,
    authenticate,
    updateProfile
)

export default router