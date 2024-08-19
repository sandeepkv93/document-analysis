import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import documentAnalysisRouter from './routes/documentAnalysisRoutes'
import healthRouter from './routes/heathRoutes'

const app: Express = express()

// Middlewares

// 1. Enable CORS
app.use(cors())
// 2. Parse JSON bodies
app.use(express.json())
// 3. Log requests using morgan
app.use(morgan('dev'))

// Routes

// 1. healthcheck routes
app.use(healthRouter)
// 2. document analysis routes
app.use('/api', documentAnalysisRouter)

export default app
