const express = require('express')
const app = express()
const port = process.env.PORT || 3224

app.use(express.json())


const updateStocksRouter = require('./routes/updateStocksRouter.js')
app.use('/', updateStocksRouter)


app.listen(port, () => {
  console.log(`-----------------------------------------------`)
  console.log(`- Express Server is listening on http://localhost:${port}  -`)
  console.log(`-----------------------------------------------`)
})

