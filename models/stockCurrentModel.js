module.exports = (sequelize, DataTypes) => {

    const stock_current = sequelize.define("stock_current", {
        stock_symbol:{
            type: DataTypes.STRING,
            allowNull: false
        },
        stock_value:{
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    });

    return stock_current;
}