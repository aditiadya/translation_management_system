import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProjectInputFiles = sequelize.define(
  "ProjectInputFiles",
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
      onDelete: "CASCADE",
    },
    file_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    input_for_jobs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "project_input_file",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  }
);

ProjectInputFiles.beforeValidate(async (file, options) => {
  if (file.file_code) return;

  const transaction = options?.transaction;

  const lastFile = await ProjectInputFiles.findOne({
    order: [["id", "DESC"]],
    attributes: ["file_code"],
    transaction,
  });

  let next = 1;

  if (lastFile?.file_code) {
    const numeric = parseInt(lastFile.file_code.substring(1));
    if (!Number.isNaN(numeric)) next = numeric + 1;
  }

  file.file_code = `PI${next.toString().padStart(4, "0")}`;
});

ProjectInputFiles.associate = (models) => {
  ProjectInputFiles.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
    onDelete: "CASCADE",
  });
};

export default ProjectInputFiles;