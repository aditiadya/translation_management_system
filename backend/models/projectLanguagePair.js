import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProjectLanguagePair = sequelize.define(
  "ProjectLanguagePair",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "project_details",
        key: "id",
      },
    },
    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_language_pairs",
        key: "id",
      },
    },
  },
  {
    tableName: "project_language_pairs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["project_id", "language_pair_id"],
      },
    ],
  }
);

ProjectLanguagePair.associate = (models) => {
  ProjectLanguagePair.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
  });

  ProjectLanguagePair.belongsTo(models.AdminLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
  });
};

export default ProjectLanguagePair;