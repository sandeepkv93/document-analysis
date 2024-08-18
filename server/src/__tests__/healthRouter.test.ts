import express, { Application } from 'express'
import request from 'supertest'
import healthRouter from '../routes/heathRoutes'

const app: Application = express()
app.use(express.json())
app.use('/', healthRouter)

describe('Health Router', () => {
  it('should respond with a pong message on POST /ping', async () => {
    const response = await request(app).post('/ping')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'pong' })
  })
})
