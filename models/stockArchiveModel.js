module.exports = (sequelize, DataTypes) => {

    // Define a new model, representing a table in the database.
    // modelName is 'customer' (first argument of define() function)
    // When synced, this will create a table name of "modelName" + "s", i.e. "customers"
    const stock_archive = sequelize.define("stock_archive", {
        stock_symbol:{
            type: DataTypes.STRING,
            allowNull: false
        },
        stock_value:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        date:{
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return stock_archive;
}