export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("job_details", {
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

      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "project_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vendor_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      vendor_contact_person_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "vendor_contact_persons",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "admin_services",
          key: "id",
        },
        onDelete: "CASCADE",
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

      deadline_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      free_of_charge: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      auto_start_on_vendor_acceptance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      note_for_vendor: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      internal_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      pdf_template_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      checklist_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("job_details");
  },
};