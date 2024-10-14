'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProcessType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Window, { foreignKey: 'window', targetKey: 'window' });
    }
  }
  ProcessType.init({
    window: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Window cannot be empty'
        }
      }
    },
    process_type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Process type cannot be empty'
        }
      },
      unique: {
        msg: 'Process type already exists'
      }
    },
    coding: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Coding cannot be empty'
        }
      },
      unique: {
        msg: 'Coding already exists'
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
    modelName: 'ProcessType',
  });
  return ProcessType;
};