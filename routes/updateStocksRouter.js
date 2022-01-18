const updateStocksController = require('../controllers/updateStocksController')
const router = require('express').Router()


// access all of the stocks in the database
router.get('/', updateStocksController.sendToController)

// access all of the stocks in the database
router.get('/restartServer', updateStocksController.restartServer)

// access all of the stocks in the database
router.get('/updateOptions', updateStocksController.updateOptions)

// access all of the stocks in the database
router.get('/serverStatus', updateStocksController.checkServerStatus)

// access all of the stocks in the database
router.post('/stopServer', updateStocksController.serverAsleep)

// access all of the stocks in the database
router.post('/startServer', updateStocksController.serverAwake)

// access all of the stocks in the database
router.delete('/deleteStock/:symbol', updateStocksController.deleteStockFromStocks)

// access all of the stocks in the database
router.post('/addStock/:symbol', updateStocksController.addStockToStocks)

module.exports = router