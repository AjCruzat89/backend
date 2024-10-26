'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Queue, { foreignKey: 'transaction_id', targetKey: 'id' });
    }
  }
  Transaction.init({
    transaction_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Transaction ID cannot be empty'
        }
      }
    },
    amount: {
      type: DataTypes.DECIMAL,
      validate: {
        notEmpty: {
          msg: 'Amount cannot be empty'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};