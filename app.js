const config = require('config')
const express = require('express')
var router = express.Router()
const fs = require('fs')
const cors = require('cors') 
const morgan = require('morgan')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

// config constants
const morganFormat = config.get('morganFormat')
const htdocsPath = config.get('htdocsPath')
const privkeyPath = config.get('privkeyPath')
const fullchainPath = config.get('fullchainPath')
const port = config.get('port') 
const mbtilesDir = config.get('mbtilesDir')
const logDirPath = config.get('logDirPath')

// logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: `${logDirPath}/server-%DATE%.log`,
      datePattern: 'YYYY-MM-DD'
    })
  ]
})

logger.stream = {
  write: (message) => { logger.info(message.trim()) }
}

// app
const app = express()
app.use(cors())
app.use(morgan(morganFormat, {
  stream: logger.stream
}))
app.use(express.static(htdocsPath))


//Added
const esriRouter = router.get(`/:t/VectorTileServer/`, 
 async function(req, res) {
  const t = req.params.t
  var indexjsonPath = `./esri-IF/${t}/VectorTileServer/index.json`
  if(fs.existsSync( indexjsonPath )){
    res.sendFile('index.json', { root: `./esri-IF/${t}/VectorTileServer` })
  }else{
    res.status(404).send(`index.json not found: esri-IF/${t}/VectorTileServer`)
  }
 }
)

app.use('/esri-IF', esriRouter)

//for http
app.listen(port, () => {
    console.log(`Running at Port ${port} ...`)
})

