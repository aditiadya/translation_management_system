import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProjectStatusHistory = sequelize.define(
  "ProjectStatusHistory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "project_details", key: "id" },
      onDelete: "CASCADE",
    },

    old_status: {
      type: DataTypes.ENUM("Offered by Client", "Offer Accepted", "Offer Rejected", "Draft", "In Progress", "Hold", "Submitted", "Submission Accepted",  "Submission Rejected", "Cancelled"),
      allowNull: true,
    },

    new_status: {
      type: DataTypes.ENUM("Offered by Client", "Offer Accepted", "Offer Rejected", "Draft", "In Progress", "Hold", "Submitted", "Submission Accepted",  "Submission Rejected", "Cancelled"),
      allowNull: false,
    },

    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "project_status_history",
    timestamps: false,
  }
);

ProjectStatusHistory.associate = (models) => {
  ProjectStatusHistory.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
    onDelete: "CASCADE",
  });
};

export default ProjectStatusHistory;