import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import healthRouter from './routes/heathRoutes'

const app: Express = express()

// Middlewares

// Enable CORS
app.use(cors())
// Parse JSON bodies
app.use(express.json())
// Log requests using morgan
app.use(morgan('dev'))

// healthcheck routes
app.use(healthRouter)

export default app
