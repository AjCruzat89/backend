'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Window, { foreignKey: 'window', targetKey: 'window' });
      this.hasMany(models.Transaction, { foreignKey: 'transaction_id', sourceKey: 'id' });
    }
  }
  Queue.init({
    window: DataTypes.STRING,
    queue_number: DataTypes.STRING,
    process: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Queue',
  });
  return Queue;
};