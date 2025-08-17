import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminLanguagePair = sequelize.define(
  "AdminLanguagePair",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    source_language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_language_pairs",
    timestamps: false,
  }
);

AdminLanguagePair.associate = (models) => {
  if (models.AdminAuth) {
    AdminLanguagePair.belongsTo(models.AdminAuth, {
      foreignKey: "email",
      targetKey: "email",
      as: "admin",
    });
  }
  if (models.Language) {
    AdminLanguagePair.belongsTo(models.Language, {
      foreignKey: "source_language_id",
      as: "sourceLanguage",
    });
    AdminLanguagePair.belongsTo(models.Language, {
      foreignKey: "target_language_id",
      as: "targetLanguage",
    });
  }
};

export default AdminLanguagePair;
