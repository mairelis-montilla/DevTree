import {Router} from 'express'
import {body} from 'express-validator'
import { createAccount, getUser, login, updateProfile, uploadImage, getUserByHandle, searchByHandle } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'
import { AnalyticsController } from './controllers/AnalyticsController'

const router = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - handle
 *               - name
 *               - email
 *               - password
 *             properties:
 *               handle:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: johndoe
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña (mínimo 8 caracteres)
 *                 example: mypassword123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Registro creado correctamente
 *       409:
 *         description: El usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Errores de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/register',
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    createAccount
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Errores de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/login',
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('El password es muy corto, mínimo 8 caracteres'),
    login
)

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user', authenticate, getUser)

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Actualizar perfil del usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - handle
 *               - description
 *             properties:
 *               handle:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: johndoe
 *               description:
 *                 type: string
 *                 description: Descripción del perfil
 *                 example: Desarrollador Full Stack
 *               links:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://github.com/johndoe
 *                     title:
 *                       type: string
 *                       example: GitHub
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       409:
 *         description: El handle ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Errores de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/user',
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('description').notEmpty().withMessage('la descripción no puede ir vacía'),
    handleInputErrors,
    authenticate,
    updateProfile
)

/**
 * @swagger
 * /user/image:
 *   post:
 *     summary: Subir imagen de perfil
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   description: URL de la imagen subida
 *                   example: https://res.cloudinary.com/...
 *       500:
 *         description: Error al subir la imagen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/user/image', authenticate, uploadImage)

/**
 * @swagger
 * /analytics:
 *   post:
 *     summary: Registrar un evento de analítica (visita o click)
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - handle
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [visit, click]
 *                 description: Tipo de evento
 *                 example: visit
 *               handle:
 *                 type: string
 *                 description: Handle del usuario
 *                 example: johndoe
 *               link:
 *                 type: string
 *                 description: URL del enlace clickeado (solo para tipo click)
 *                 example: https://github.com/johndoe
 *     responses:
 *       201:
 *         description: Evento registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Evento registrado correctamente
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Errores de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/analytics', AnalyticsController.trackEvent)

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Obtener estadísticas del usuario autenticado
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Analytics'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al obtener las estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/analytics/dashboard', authenticate, AnalyticsController.getStats)

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Buscar usuarios
 *     tags: [Búsqueda]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   handle:
 *                     type: string
 *                     example: johndoe
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   description:
 *                     type: string
 *                     example: Desarrollador Full Stack
 *                   image:
 *                     type: string
 *                     example: https://res.cloudinary.com/...
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', searchByHandle)

/**
 * @swagger
 * /{handle}:
 *   get:
 *     summary: Obtener perfil público de un usuario por su handle
 *     tags: [Perfil Público]
 *     parameters:
 *       - in: path
 *         name: handle
 *         required: true
 *         schema:
 *           type: string
 *         description: Handle del usuario
 *         example: johndoe
 *     responses:
 *       200:
 *         description: Perfil público del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 handle:
 *                   type: string
 *                   example: johndoe
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 description:
 *                   type: string
 *                   example: Desarrollador Full Stack
 *                 image:
 *                   type: string
 *                   example: https://res.cloudinary.com/...
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                       title:
 *                         type: string
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: El usuario no existe
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Hubo un error
 */
router.get('/:handle', getUserByHandle)

export default router