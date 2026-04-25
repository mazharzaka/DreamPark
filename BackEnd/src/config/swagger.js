import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dream Park API',
      version: '1.0.0',
      description: 'API Documentation for the Dream Park backend service.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Hero',
        description: 'Operations related to page Hero sections',
      },
      {
        name: 'Attractions',
        description: 'Operations related to park rides and attractions',
      },
      {
        name: 'Auth',
        description: 'User registration and login operations',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
