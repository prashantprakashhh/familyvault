// models/photo.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Photo extends Model {
    static associate(models) {
      // A photo belongs to a user
      Photo.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Photo.init({
    // If your actual DB column is user_id, map it like this:
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',    // <--- this key ensures the model references the column named 'user_id'
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'photos',
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false
  });

  return Photo;
};
