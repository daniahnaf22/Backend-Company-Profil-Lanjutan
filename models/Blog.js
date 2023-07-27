import { Sequelize } from "sequelize";
import db from "../db.js";

const { DataTypes } = Sequelize;

const Blog = db.define("Blog", {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  img: DataTypes.TEXT,
  desc: DataTypes.TEXT,
  createBy: DataTypes.STRING,
});

export default Blog;