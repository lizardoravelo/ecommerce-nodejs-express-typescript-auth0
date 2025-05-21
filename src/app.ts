import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger';
import cors from 'cors';
import config from './config/constants';
import { router } from '@routes';

const app: Application = express();

//Listener
const server = app.listen(config.port, () => {
  console.log(`Server connected to port ${config.port}`);
});

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Handling Error
process.on('unhandledRejection', (err: Error) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
