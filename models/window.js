'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Window extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ProcessType, { foreignKey: 'window', sourceKey: 'window' });
      this.hasMany(models.Queue, { foreignKey: 'window', sourceKey: 'window' });
    }
  }
  Window.init({
    window: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Window already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Window cannot be empty'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Status cannot be empty'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Window',
  });
  return Window;
};