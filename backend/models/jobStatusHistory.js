import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const JobStatusHistory = sequelize.define(
  "JobStatusHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    old_status: {
      type: DataTypes.ENUM(
        "Draft",
        "Offered to Vendor",
        "Offer Accepted",
        "Offer Rejected",
        "Started",
        "Completed",
        "Hold",
        "Completion Accepted",
        "Completion Rejected",
        "Cancelled"
      ),
      allowNull: true,
    },
    new_status: {
      type: DataTypes.ENUM(
        "Draft",
        "Offered to Vendor",
        "Offer Accepted",
        "Offer Rejected",
        "Started",
        "Completed",
        "Hold",
        "Completion Accepted",
        "Completion Rejected",
        "Cancelled"
      ),
      allowNull: false,
    },
    changed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    changed_by: {
      type: DataTypes.ENUM("admin", "vendor"),
      allowNull: false,
      defaultValue: "admin",
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    auto_transitioned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "job_status_history",
    timestamps: false,
  }
);

JobStatusHistory.associate = (models) => {
  JobStatusHistory.belongsTo(models.JobDetails, {
    foreignKey: "job_id",
    as: "job",
    onDelete: "CASCADE",
  });
};

export default JobStatusHistory;