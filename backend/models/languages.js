import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Language = sequelize.define(
  "Language",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "languages",
    timestamps: false,
  }
);

Language.associate = (models) => {
  if (models.AdminLanguagePair) {
    Language.hasMany(models.AdminLanguagePair, {
      foreignKey: "source_language_id",
      as: "sourceLanguagePairs",
    });
    Language.hasMany(models.AdminLanguagePair, {
      foreignKey: "target_language_id",
      as: "targetLanguagePairs",
    });
  }
};

export default Language;
