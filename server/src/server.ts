import http from 'http'
import app from './app'

const PORT: number = Number(process.env.PORT) || 4000

const server: http.Server = http.createServer(app)

server.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
