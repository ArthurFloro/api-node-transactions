import { app } from './app.js'
import { env } from './env/index.js'

app
  .listen({
    host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
