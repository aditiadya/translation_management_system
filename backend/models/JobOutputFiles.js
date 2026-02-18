import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const JobOutputFiles = sequelize.define(
  "JobOutputFiles",
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
    file_type: {
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
    uploaded_by_vendor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vendor_details",
        key: "id",
      },
      comment: "If uploaded by vendor",
    },
    input_for_job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_project_output: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "job_output_files",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  }
);

JobOutputFiles.beforeValidate(async (file, options) => {
  if (file.file_code) return;

  const transaction = options?.transaction;

  const lastFile = await JobOutputFiles.findOne({
    order: [["id", "DESC"]],
    attributes: ["file_code"],
    transaction,
  });

  let next = 1;

  if (lastFile?.file_code) {
    const numeric = parseInt(lastFile.file_code.replace("JO", ""));
    if (!Number.isNaN(numeric)) next = numeric + 1;
  }

  file.file_code = `JO${next.toString().padStart(4, "0")}`;
});

JobOutputFiles.associate = (models) => {
    JobOutputFiles.belongsTo(models.ProjectDetails, { 
    foreignKey: "project_id",
    as: "project",
    onDelete: "CASCADE",
  });

  JobOutputFiles.belongsTo(models.JobDetails, {
    foreignKey: "job_id",
    as: "job",
    onDelete: "CASCADE",
  });

  JobOutputFiles.belongsTo(models.AdminAuth, {
    foreignKey: "uploaded_by",
    as: "adminUploader",
  });

  JobOutputFiles.belongsTo(models.VendorDetails, {
    foreignKey: "uploaded_by_vendor",
    as: "vendorUploader",
  });
};

export default JobOutputFiles;