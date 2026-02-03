import { DataTypes } from "sequelize";

export default {
  async up(queryInterface) {
    await queryInterface.createTable("project_details", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "admin_auth", key: "id" },
        onDelete: "CASCADE",
      },

      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "client_details", key: "id" },
        onDelete: "CASCADE",
      },

      client_contact_person_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "client_contact_persons", key: "id" },
        onDelete: "CASCADE",
      },

      project_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      service_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "admin_services", key: "id" },
        onDelete: "CASCADE",
      },

      language_pair_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "admin_language_pairs", key: "id" },
        onDelete: "CASCADE",
      },

      specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "admin_specializations", key: "id" },
        onDelete: "CASCADE",
      },

      start_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      deadline_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      legal_entity: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      internal_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      primary_manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "manager_details", key: "id" },
        onDelete: "CASCADE",
      },

      secondary_manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "manager_details", key: "id" },
        onDelete: "CASCADE",
      },

      status: {
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
        defaultValue: "In Progress",
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("project_details");
  },
};