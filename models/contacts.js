const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../scripts/config');

class Contacts extends Model { }
Contacts.init({
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    location: DataTypes.STRING,
    
    createdBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedAt: DataTypes.DATE
}, { sequelize, modelName: 'contacts', freezeTableName: true });

Contacts.sync({ alter: true })
    .then(() => {
        console.log('Contacts table created successfully');
    })
    .catch((error) => {
        console.log(`Error creating Contacts: ${error}`);
    });
module.exports = { Contacts };