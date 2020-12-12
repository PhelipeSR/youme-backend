import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Recovery, {
        foreignKey: 'user_id',
        as: 'recovery',
      });
    }
  };

  User.init({
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [1,50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        len: [3,100]
      }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [6,1000]
      },
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      },
      // get() {
      //   return undefined;
      // }
    },
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { },
      },
    }
  });

  return User;
};
