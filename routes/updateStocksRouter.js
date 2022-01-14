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
router.get('/stopServer', updateStocksController.serverAsleep)

// access all of the stocks in the database
router.get('/startServer', updateStocksController.serverAwake)

module.exports = router