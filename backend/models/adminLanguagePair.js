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
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    source_language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "languages",
        key: "id",
      },
    },
    target_language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "languages",
        key: "id",
      },
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_language_pairs",
    timestamps: true,
    indexes: [
      {
        fields: ["admin_id"],
      },
      {
        fields: ["source_language_id"],
      },
      {
        fields: ["target_language_id"],
      },
      {
        unique: true,
        fields: ["admin_id", "source_language_id", "target_language_id"],
        name: "uniq_admin_lang_pair",
      },
    ],
  }
);

AdminLanguagePair.associate = (models) => {
  if (models.AdminAuth) {
    AdminLanguagePair.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
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
  AdminLanguagePair.belongsToMany(models.VendorDetails, {
    through: models.VendorLanguagePair,
    foreignKey: "language_pair_id",
    otherKey: "vendor_id",
    as: "vendors",
  });
};

export default AdminLanguagePair;