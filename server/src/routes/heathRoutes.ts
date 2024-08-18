import { Request, Response, Router } from 'express'

const healthRouter: Router = Router()

// POST /ping endpoint
healthRouter.post('/ping', (req: Request, res: Response): void => {
  res.json({ message: 'pong' })
})

export default healthRouter
