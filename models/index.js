const dbConfig = require('../config/dbConfig')
const { Sequelize, DataTypes } = require('sequelize')

// construct the sequelize object using the constructor
let sequelize = null;

    if (process && process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
                }
              }
            }
        );
    } else {
       sequelize = new Sequelize(
        { // use imported configurations from dbConfig
            database: dbConfig.DB,
            username: dbConfig.USER,
            password: dbConfig.PASSWORD,
            dialect: dbConfig.dialect,
            host: dbConfig.HOST,
        })
    }

 
sequelize.authenticate()
    .then(() => { 
        console.log(`---------------------------------------`)
        console.log(`-   Connected to Postgres Database    -`)
        console.log(`---------------------------------------`)
    })
    .catch(e => console.log('unable to connect to Postgres DB' + e))


const db = {}
db.sequelize = sequelize

// Creates a table called Stock_Archives in the db
db.Stock_Archives = require('./stockArchiveModel')(sequelize, DataTypes)
db.Stock_Info = require('./stockInfoModel')(sequelize, DataTypes)
db.Stock_Current = require('./stockCurrentModel')(sequelize, DataTypes)
// sync the db by running the model
// "force: false" ensures that the table is not created again every time the program runs
db.sequelize.sync({ force: false })
    .then(() => {
        console.log(`---------------------------------------`)
        console.log(`-      DB synced with sequelize       -`)
        console.log(`---------------------------------------`)
    })
    .catch((error) => console.log('Error syncing the DB to sequelize' + error))

db.Stock_Archives.belongsTo(db.Stock_Info);
db.Stock_Info.hasMany(db.Stock_Archives);

db.Stock_Info.hasOne(db.Stock_Current);
db.Stock_Current.belongsTo(db.Stock_Info);

module.exports = db