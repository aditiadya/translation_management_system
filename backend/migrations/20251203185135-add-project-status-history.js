import { DataTypes } from "sequelize";

export default {
  async up(queryInterface) {
    await queryInterface.createTable("project_status_history", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "project_details", key: "id" },
        onDelete: "CASCADE",
      },

      old_status: {
        type: DataTypes.ENUM(
          "Offered by Client",
          "Offer Accepted",
          "Offer Rejected",
          "Draft",
          "In Progress",
          "Hold",
          "Submitted",
          "Submission Accepted",
          "Submission Rejected",
          "Cancelled"
        ),
        allowNull: true,
      },

      new_status: {
        type: DataTypes.ENUM(
          "Offered by Client",
          "Offer Accepted",
          "Offer Rejected",
          "Draft",
          "In Progress",
          "Hold",
          "Submitted",
          "Submission Accepted",
          "Submission Rejected",
          "Cancelled"
        ),
        allowNull: false,
      },

      changed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("project_status_history");
  },
};