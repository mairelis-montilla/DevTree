import { Router } from 'express';
import { body } from 'express-validator';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticate } from '../middleware/auth';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/analytics:
 *   post:
 *     summary: Registrar un evento de analítica (visita o click)
 *     tags: [Analytics API]
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
router.post('/',
    body('type')
        .isIn(['visit', 'click'])
        .withMessage('El tipo debe ser visit o click'),
    body('handle')
        .notEmpty()
        .withMessage('El handle del usuario es obligatorio'),
    handleInputErrors,
    AnalyticsController.trackEvent
);

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Obtener estadísticas del usuario autenticado
 *     tags: [Analytics API]
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
router.get('/dashboard',
    authenticate,
    AnalyticsController.getStats
);

export default router;