const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Dis_Location: { type: DataTypes.STRING, allowNull: false },
        Pred: { type: DataTypes.FLOAT, allowNull: false },
    };

    return sequelize.define('Results', attributes);
}