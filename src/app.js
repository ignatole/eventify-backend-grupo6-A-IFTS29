import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './middleware/logger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';
import indexRouter from './routes/index.js';
import tasksRouter from './routes/tasks.js';
import clientsRouter from './routes/clients.js';
import productsRouter from './routes/products.js';
import projectsRouter from './routes/projects.js';
import departmentsRouter from './routes/departments.js';
import authRouter from './routes/auth.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.disable('x-powered-by');
app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(logger);

// Auth routes (públicas) - protegidas con authLimiter
app.use('/auth', authLimiter, authRouter);
app.use('/api/auth', authLimiter, authRouter);

// Rutas protegidas (requieren usuario autenticado)
app.use(authenticate);

app.use('/', indexRouter);
app.use('/tasks', tasksRouter);
app.use('/clients', clientsRouter);
app.use('/products', productsRouter);
app.use('/projects', projectsRouter);
app.use('/departments', departmentsRouter);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// Start server after DB connection
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Eventify Task Manager running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to DB connection error');
    process.exit(1);
  });
