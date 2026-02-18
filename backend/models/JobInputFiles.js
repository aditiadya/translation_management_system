import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const JobInputFiles = sequelize.define(
  "JobInputFiles",
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
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "job_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    project_input_file_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "project_input_file",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "If linked from project input files",
    },
    file_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Only if directly uploaded",
    },
    original_file_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    output_from_job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "admin_auth",
        key: "id",
      },
    },
    is_linked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "True if linked from project files, false if directly uploaded",
    },
  },
  {
    tableName: "job_input_files",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  }
);

JobInputFiles.beforeValidate(async (file, options) => {
  if (file.file_code) return;

  const transaction = options?.transaction;

  const lastFile = await JobInputFiles.findOne({
    order: [["id", "DESC"]],
    attributes: ["file_code"],
    transaction,
  });

  let next = 1;

  if (lastFile?.file_code) {
    const numeric = parseInt(lastFile.file_code.replace("JI", ""));
    if (!Number.isNaN(numeric)) next = numeric + 1;
  }

  file.file_code = `JI${next.toString().padStart(4, "0")}`;
});

JobInputFiles.associate = (models) => {
    JobInputFiles.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
    onDelete: "CASCADE",
  });

  JobInputFiles.belongsTo(models.JobDetails, {
    foreignKey: "job_id",
    as: "job",
    onDelete: "CASCADE",
  });

  JobInputFiles.belongsTo(models.ProjectInputFiles, {
    foreignKey: "project_input_file_id",
    as: "linkedProjectFile",
    onDelete: "SET NULL",
  });

  JobInputFiles.belongsTo(models.AdminAuth, {
    foreignKey: "uploaded_by",
    as: "uploader",
  });
};

export default JobInputFiles;