import { Sequelize } from "sequelize";
import db from "../db.js";

const { DataTypes } = Sequelize;

const Contact = db.define("Contact", {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  subject: DataTypes.STRING,
  message: DataTypes.TEXT,
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

export default Contact;
