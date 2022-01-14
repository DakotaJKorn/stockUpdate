module.exports = (sequelize, DataTypes) => {

    const stock = sequelize.define("stock", {
        stock_symbol:{
            type: DataTypes.STRING,
            allowNull: false    
        },
        stock_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        stock_sector:{
            type: DataTypes.STRING,
            allowNull: false
        },
        stock_industry:{
            type: DataTypes.STRING,
            allowNull: false
        },
        stock_description:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        stock_exchange:{
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return stock;
}