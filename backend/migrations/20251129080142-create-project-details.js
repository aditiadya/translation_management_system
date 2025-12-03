export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_details", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "admin_auth",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "client_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      client_contact_person_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "client_contact_persons",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      project_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      language_pair_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admin_language_pairs",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      specialization_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admin_specializations",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      start_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      deadline_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      legal_entity: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      internal_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      primary_manager_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "manager_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      secondary_manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "manager_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      status: {
        type: Sequelize.ENUM("Pending", "In Progress", "Completed", "Rejected"),
        allowNull: false,
        defaultValue: "In Progress",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("project_details");
  },
};