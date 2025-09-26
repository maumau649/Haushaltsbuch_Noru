const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WebApp Backend API',
      version: '1.0.0',
      description: 'REST API für die WebApp mit User-Management',
      contact: {
        name: 'API Support',
        email: 'support@webapp.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000' 
          : 'http://backend:5000',
        description: process.env.NODE_ENV === 'development' 
          ? 'Development Server' 
          : 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'Eindeutige Benutzer-ID'
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'Benutzername (3-30 Zeichen)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'E-Mail-Adresse des Benutzers'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Erstellungsdatum'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Letzte Aktualisierung'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              example: 'maxmustermann'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'max@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT Token für Authentifizierung'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentifizierung erforderlich',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Ressource nicht gefunden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validierungsfehler',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentifizierung und Benutzerverwaltung'
      },
      {
        name: 'Users',
        description: 'Benutzeroperationen'
      }
    ]
  },
  apis: [
    './src/routes/*.js', // Pfad zu den Route-Dateien
  ],
};

const specs = swaggerJsdoc(options);

// Swagger UI Konfiguration
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WebApp API Dokumentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
  }
};

module.exports = function(app) {
  // API Dokumentation Route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  // JSON Spezifikation Route
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger Dokumentation verfügbar unter: /api-docs');
};