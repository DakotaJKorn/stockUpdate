const updateStocksController = require('../controllers/updateStocksController')
const router = require('express').Router()


// access all of the stocks in the database
router.get('/', updateStocksController.keepAwake)

// access all of the stocks in the database
router.get('/restartServer', updateStocksController.restartServer)


module.exports = router