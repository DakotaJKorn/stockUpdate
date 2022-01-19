let requestify = require('requestify');
let stocks = require('../stocks').stocks;

const docClient = require('../config/dynamoDBConfig').docClient;
const db = require('../models/index')
const StockArchivesTable = db.Stock_Archives
const StockInfoTable = db.Stock_Info
const StockCurrentTable = db.Stock_Current

let updateStockInformation = false

const intervalTime = 1000 * 60
let updateStocksInterval = 15
let updateArchivesTime = 17
let functionCalled = false
let serverUp = false
let serverRestarted = false

let date = new Date()

let restartServer = async(request, response, next) => {
 
    serverUp = true
    serverRestarted = true
    
    await getStockIDandNameFromDB()

    updateStocks()

    response.status(200).send("Server started! DO NOT REFRESH OR CLOSE PAGE")
}

let serverAsleep = () => {
    serverUp = false
    console.log("Server Down!")
}

let serverAwake = () => {
    serverUp = true
    if(serverRestarted == false)
        restartServer()
    console.log("Server UP!")
}

let updateOptions = async() =>{

    let params = {
        TableName: 'StockConsoleTable',
        Key: {
            'id' : 1,
          }
    }

    await docClient.get(params, function(err, data) {
        let obj = data.Item

        updateArchivesTime = obj.update_archive_time
        updateStocksInterval = obj.update_stock_interval
      })
}

let getStockIDandNameFromDB = async() =>{
    for(let stock of stocks){
        let data = await StockInfoTable.findOne({where:{stock_symbol: stock.stock_symbol}})
        stock['stock_id'] = data.dataValues.id
        stock['stock_name'] = data.dataValues.stock_name
    }
}


const updateStocks = async () => {

    console.log("made it to this method")
      /* 
    setInterval(() => { 
            console.log('Once through the interval')
         
        if(serverUp){
            date = new Date()
            let hour = date.getHours()
            let minute = date.getMinutes()
    
            if(minute % updateStocksInterval == 0){
                console.log("Updating Stocks!")
                    getStocks()
            }
    
            if(hour == updateArchivesTime) 
                if(!functionCalled){
                    functionCalled = true;
                    console.log("Updating Archives!")
                    getArchives()
                }
            
            if(hour == 18)
                functionCalled = false;
        }   
    }, intervalTime);
    */
}

let getCurrentPrices = async () => {
    let stock_symbols = new Array()

    for(let i = 0; i < stocks.length; i++)
        stock_symbols.push(stocks[i].stock_symbol)

    let obj = ''

    let url = `https://financialmodelingprep.com/api/v3/quote-short/${stock_symbols.toString()}?apikey=3241e77649a6b0b8c26d6357a72b8f7e` 
        await requestify.get(url)
            .then((response) => obj = response.getBody())
            .catch((err) => console.log('Requestify Error', err)) 


    for(let returnStock of obj)
        for(let stock of stocks)
            if(returnStock.symbol == stock.stock_symbol){
                stock.stock_value = returnStock.price
            }
}

let getArchives = async() => {

    await getCurrentPrices()
    updateStockArchivesDatabase()
}

let getStocks = async () => {

    await getCurrentPrices()
    updateStockCurrentDatabase()
    //updateDynamoDB()
}

let updateStockArchivesDatabase = async() => {
    const date = new Date()
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const dateString = "" + date.toLocaleDateString("en-US", options)
    
    let input_data = {
        stock_symbol: " ",
        stock_value: 0,
        date: dateString,
        stockId: ""
    }
    
    for(let stock of stocks){
        input_data.stock_symbol = stock.stock_symbol
        input_data.stock_value = stock.stock_value
        input_data.stockId = stock.stock_id
        StockArchivesTable.create(input_data)
    }
    console.log("Postgres DB Updated!!!")  
}

let updateStockCurrentDatabase = async() => {
    let input_data = {
        stock_symbol: "",
        stock_value: 0,
        stockId: ""
    }
    
    for(let stock of stocks){
        input_data.stock_symbol = stock.stock_symbol
        input_data.stock_value = stock.stock_value
        input_data.stockId = stock.stock_id
        StockCurrentTable.create(input_data, { where: {stock_symbol: stock.stock_symbol}})
    }
    console.log("Postgres DB Updated!!!")  
}

let getStockInformation = (num) => {

    if(num == stocks.length)
        updateStockInformationTable()
    
    else{
        let symbol = stocks[num].stock_symbol
        let url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=3241e77649a6b0b8c26d6357a72b8f7e` 
        requestify.get(url).then((response) => {
                stocks[num].stock_name = response.getBody()[0].companyName
                stocks[num].stock_sector = response.getBody()[0].sector
                stocks[num].stock_industry = response.getBody()[0].industry
                stocks[num].stock_description = response.getBody()[0].description
                stocks[num].stock_exchange = response.getBody()[0].exchangeShortName
                console.log("received: " + stocks[num].stock_symbol)
                //console.log(stocks[num])
                getStockInformation(num+1)
            })
            .catch(function(err){
                console.log('Requestify Error', err);
                getStockInformation(num+1)
            })
    }   
}

let updateStockInformationTable = () => {

    let input_data = {
        stock_symbol: "",
        stock_name: "",
        stock_sector: "",
        stock_industry: "",
        stock_description: "",
        stock_exchange: ""
        }

        for(let stock of stocks){
            input_data.stock_symbol = stock.stock_symbol
            input_data.stock_name = stock.stock_name
            input_data.stock_sector = stock.stock_sector
            input_data.stock_industry = stock.stock_industry
            input_data.stock_description = stock.stock_description
            input_data.stock_exchange = stock.stock_exchange

            StockInfoTable.create(input_data)
        }
}

let updateDynamoDB = async() =>{
    var params = {
        TableName: 'Stocks',
        Item: {
          'stock_symbol' : "",
          'stock_name' : "",
          'stock_value' : ""
        }
      };

    for(let stock of stocks){
        params.Item.stock_symbol = stock.stock_symbol
        params.Item.stock_name = stock.stock_name
        params.Item.stock_value = stock.stock_value
        docClient.put(params, function(err, data) {
            if (err)
              console.log("Error", err)  
          })
    }
    console.log("DynamoDB Updated!!!")

}

let checkServerStatus = async(request, response) =>{
    if(serverUp)
        response.status(200).send(JSON.stringify('UP'))
    else
        response.status(200).send(JSON.stringify('DOWN'))
}

let sendToController = (request, response) =>{
    response.send(" ")
    //response.redirect('http://localhost:4200/server-details');
}

let deleteStockFromStocks = async() => {
    const stock = request.params["symbol"].toUpperCase().split(",")
    stocksFile.deleteStock(stock)
    
}

let addStockToStocks = async() => {
    const stocks = request.params["symbol"].toUpperCase().split(",")
    stocksFile.addStock(stock)
}

module.exports = {
    updateOptions,
    serverAsleep,
    serverAwake,
    restartServer,
    checkServerStatus,
    sendToController,
    deleteStockFromStocks,
    addStockToStocks
}

