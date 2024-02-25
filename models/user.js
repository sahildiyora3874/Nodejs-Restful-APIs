const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reset_token: {
      type: DataTypes.STRING,
    },
    reset_token_expires_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

User.sync({ force: true })
  .then(() => {
    console.log("User model synced with the database");
  })
  .catch((error) => {
    console.error("Error syncing User model:", error);
  });

module.exports = User;
