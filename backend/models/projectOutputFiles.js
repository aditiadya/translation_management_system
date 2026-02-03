import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProjectOutputFiles = sequelize.define(
  "ProjectOutputFiles",
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

    job_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    job_service: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    job_language_pair: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    job_vendor: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    job_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "project_output_file",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  }
);

ProjectOutputFiles.beforeValidate(async (file, options) => {
  if (file.file_code) return;

  const transaction = options?.transaction;

  const lastFile = await ProjectOutputFiles.findOne({
    order: [["id", "DESC"]],
    attributes: ["file_code"],
    transaction,
  });

  let next = 1;

  if (lastFile?.file_code) {
    const numeric = parseInt(lastFile.file_code.substring(1));
    if (!Number.isNaN(numeric)) next = numeric + 1;
  }

  file.file_code = `PO${next.toString().padStart(4, "0")}`;
});

ProjectOutputFiles.associate = (models) => {
  ProjectOutputFiles.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
    onDelete: "CASCADE",
  });

  
};

export default ProjectOutputFiles;