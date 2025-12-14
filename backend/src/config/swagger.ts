import swaggerJsdoc from 'swagger-jsdoc'
import { SwaggerDefinition } from 'swagger-jsdoc'

const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'DevTree API',
        version: '1.0.0',
        description: 'API para DevTree - Plataforma de enlaces personalizables estilo LinkTree',
        contact: {
            name: 'Rodrigo Castilla',
            email: 'soporte@devtree.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:4000',
            description: 'Servidor de desarrollo'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Ingresa el token JWT obtenido del login'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        description: 'ID del usuario'
                    },
                    handle: {
                        type: 'string',
                        description: 'Nombre de usuario único'
                    },
                    name: {
                        type: 'string',
                        description: 'Nombre completo del usuario'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email del usuario'
                    },
                    description: {
                        type: 'string',
                        description: 'Descripción del perfil'
                    },
                    image: {
                        type: 'string',
                        description: 'URL de la imagen de perfil'
                    },
                    links: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string'
                                },
                                title: {
                                    type: 'string'
                                }
                            }
                        },
                        description: 'Enlaces del usuario'
                    },
                    visits: {
                        type: 'number',
                        description: 'Número total de visitas'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Mensaje de error'
                    }
                }
            },
            Analytics: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        description: 'Fecha del evento'
                    },
                    visits: {
                        type: 'number',
                        description: 'Número de visitas'
                    },
                    clicks: {
                        type: 'number',
                        description: 'Número de clicks'
                    },
                    mobileVisits: {
                        type: 'number',
                        description: 'Visitas desde dispositivos móviles'
                    }
                }
            }
        }
    }
}

const options = {
    swaggerDefinition,
    apis: ['./src/router.ts', './src/router/*.ts', './src/router/**/*.ts']
}

export const swaggerSpec = swaggerJsdoc(options)
