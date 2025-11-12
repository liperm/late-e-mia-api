import { sequelize } from '../database.js';
import { DataTypes } from 'sequelize';


export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, 
{
  tableName: 'user',
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}
);
