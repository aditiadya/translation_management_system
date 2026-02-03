export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_input_file", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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

      file_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      original_file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      file_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      file_size: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      input_for_jobs: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("project_input_file");
  },
};