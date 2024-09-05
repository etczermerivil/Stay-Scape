const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReviewImage extends Model {
    static associate(models) {
      // Define associations here
      ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    }
  }

  ReviewImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Reviews', key: 'id' },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ReviewImage',
    }
  );

  return ReviewImage;
};
