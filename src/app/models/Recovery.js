import { Model } from 'sequelize';


module.exports = (sequelize, DataTypes) => {
  class Recovery extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  };

  Recovery.init({
    token: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [50,50]
      }
    },
    status: {
      type: DataTypes.ENUM(['new', 'used']),
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isIn: [['new', 'used']]
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notNull: true,
        notEmpty: true,
      }
    },
  }, {
    sequelize,
    modelName: 'Recovery',
    underscored: true
  });

  return Recovery;
};
